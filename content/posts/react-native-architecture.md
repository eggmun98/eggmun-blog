---
title: "리액트 네이티브: 구 아키텍처 이해부터 신 아키텍처 핵심까지"
excerpt: "React Native 0.76부터 기본값으로 활성화된 New Architecture는 Bridge 기반의 한계를 극복하기 위해 JSI, TurboModules, Fabric Renderer, Codegen을 도입했다. 이 글에서는 구 아키텍처의 구조와 한계, 그리고 신 아키텍처가 제공하는 변화와 실무적인 의미를 비교 정리한다."
date: "2025-09-29"
image: "/images/react-tips-summary.jpg"
tags: ["리액트 네이티브", "React Native","아키텍처", "JSI", "TurboModules", "Fabric", "Codegen", "React18", "기술 분석"]
---


## 들어가며

React Native(RN)는 React와 동일한 선언적 UI 메커니즘을 사용해 Android/iOS 네이티브 UI를 그립니다.
우리가 작성하는 JavaScript(React/JSX) 영역과 실제로 화면을 그리는 Native(UI) 영역은 분리되어 있고, 구 아키텍처에서는 이 둘을 Bridge(브릿지)가 이어줬습니다.

> "JS에서 JSX로 UI를 선언 → Bridge를 통해 Native에 명령 전달 → Native가 진짜 뷰를 그림"

이 구조가 단순하고 강력했지만, 시간이 지나며 성능/확장 측면의 한계가 드러났고, RN 팀은 2018년부터 새로운 아키텍처로의 전환을 준비해 왔습니다. 
(참고: RN 0.76부터 New Architecture가 기본 활성화, 0.80부터 레거시는 사실상 동결/이탈 유도 방향)

## 1) 구 아키텍처(Old): Bridge 중심 파이프라인
![React Native Old Architecture](https://velog.velcdn.com/images/eggmun22/post/69ba5651-45c0-4b98-90ac-99b615e8bbe6/image.png)
> 출처: https://www.linkedin.com/pulse/react-native-new-architecture-mohammad-rehan

### 스레드 구성
- **JS Thread:** React/앱 로직 실행(React, JSX, 비즈니스 로직)
- **Shadow Thread:** Yoga 레이아웃 계산(크기/위치)
- **Native/UI Thread:** 실제 네이티브 뷰 렌더링 및 이벤트 처리
- **Bridge:** JS ↔ Native 간 비동기 배치 메시지 통신 채널(JSON 직렬화/역직렬화)

### 데이터 흐름(예시)
1. 사용자가 버튼 클릭 → Native/UI Thread가 이벤트 감지
2. 이벤트 데이터 직렬화(JSON) → Bridge → JS Thread
3. JS 로직 실행(상태 업데이트/명령 생성)
4. 업데이트 명령 직렬화(JSON) → Bridge → Native
5. 역직렬화 후 실제 UI 갱신

### 렌더 파이프라인(간략)
**Render → Commit → Mount**
- Render: JS가 React Element Tree 생성 → Shadow Thread가 React Shadow Tree 구성
- Commit: Yoga가 각 노드의 크기/위치 계산
- Mount: 계산 결과를 Host View Tree(UIView / ViewGroup 등)로 변환·적용

```jsx
<View style={{ width: 200, height: 200, backgroundColor: 'blue' }}>
  <Text>Hello World</Text>
</View>
```

### 장점 ↔ 한계

**장점**

- 단순·검증된 구조, 풍부한 생태계, 메인 스레드 차단 없이 비동기 처리

**한계**

- Bridge 병목: 단일 채널·배치 큐로 우선순위 제어 어려움
- 직렬화 비용: 잦은 직렬화/역직렬화로 CPU/메모리 오버헤드
- 동기 호출 부재: 즉시 결과가 필요한 케이스(측정 등)에 제약
- 스레드 비동기화: 스크롤·애니메이션 시 빈 영역/깜빡임 가능
- 부담: 모든 네이티브 모듈을 앱 시작 시 사전 로드(예: 매우 빠른 스크롤 중 리스트 셀 생성/파괴 명령이 비동기 큐에 쌓이면, 중간 프레임에 빈 영역이 보일 수 있음.)


## 2) 신 아키텍처(New): Bridge 제거 & 직접 통신
![React Native New Architecture](https://velog.velcdn.com/images/eggmun22/post/383fec2a-3e33-4aee-8bd7-1b44de190fcc/image.png)
> 출처: https://www.linkedin.com/pulse/react-native-new-architecture-mohammad-rehan/

**목표**

- Bridge 제거 및 JSI(직접 호출) 도입
- 동기/비동기 모두 지원(필요 시 동기 경로)
- React 18 기능과의 정합성 강화(Concurrent 기능 체감은 점진 마이그레이션 시↑)
- Codegen으로 타입 안전성과 보일러플레이트 자동화
- Fabric을 통한 렌더링 파이프라인 최적화

### 핵심 구성요소

**2-1. JSI (JavaScript Interface)**

- C++ 기반의 경량 인터페이스
- 직렬화 없이 JS ↔ Native를 직접 호출 가능(참조 공유)

```js
// Old: 콜백/비동기
nativeModule.getValue(value => {
  nativeModule.doSomething(value);
});

// New: 동기 호출 가능
const value = nativeModule.getValue();
nativeModule.doSomething(value);
```
효과: 직렬화/역직렬화 제거, 컨텍스트 전환 비용 감소, 필요 시 동기적 상호작용 가능

**2-2. TurboModules**

- 지연 로딩(Lazy Loading): 필요한 모듈만 로드 → 앱 시작 속도/메모리 개선
- JSI 기반 직접 호출: Bridge 경유 제거
- Codegen + 정적 타입 계약: 컴파일 타임 검증
- C++ 구현 공유: 멀티플랫폼 재사용 용이

**2-3. Fabric Renderer**

- RN 렌더러 전면 재작성(C++)
- Render/Commit/Mount 파이프라인을 멀티스레드·우선순위 기반으로 개선
- Immutable Shadow Tree로 스레드 안전성 보장
- View Flattening 등 최적화 적용(플랫폼 일관성)
- 동기 경로 제공: 측정/툴팁 위치 등 useLayoutEffect 시나리오 개선

**2-4. Codegen**

- JS(또는 TS/Flow) 인터페이스로부터 네이티브 바인딩 코드 자동 생성
- 경계 간( JS ↔ C++/Native ) 타입 안전성 확보
- 보일러플레이트 감소, 유지보수성↑

**3) Old vs New 한눈 비교**

![react native architecture old vs new](https://velog.velcdn.com/images/eggmun22/post/067b3df6-1418-43c7-9c6f-f784f1c719de/image.png)

> 포인트: 성능은 "즉시 무조건 빨라진다"가 아니라 "빠른 경로가 열렸다"에 가깝습니다. 앱 구조/디바이스/사용 패턴에 따라 체감 폭은 달라집니다.

## 4) 실무에서 달라지는 것들
**React 18 기능 활용**

- Transitions/Suspense/자동 배칭으로 UX 끊김 최소화
- 긴급 입력(press/drag) vs 비긴급 전환 작업을 분리해 프레임 안정성 향상

**레이아웃 동기 측정**
- 이전: onLayout(비동기) → 한 프레임 늦게 반영
- 이제: useLayoutEffect 내 동기 접근 가능(툴팁/측정 등)

```tsx
useLayoutEffect(() => {
  const rect = ref.current?.getBoundingClientRect?.(); // 개념 예시
  setPosition(rect);
}, []);
```

**네이티브 모듈/컴포넌트 개발**
- TurboModules + Codegen으로 타입 안전·동기 호출 지원
- C++ 공유 코어 덕분에 다중 플랫폼 대응 용이

**라이브러리 호환성**
- 상호 운용(interop) 레이어로 점진적 전환 가능
- 다만 새 아키텍처 네이티브 API로 마이그레이션해야 동시성/동기 경로 이점을 온전히 누림

## 5) 구 아키텍처를 이해하기 위한 비유
```less
[JS Thread] --(JSON 배치 메시지/비동기)--> [Bridge] --(역직렬화)--> [Native/UI]
                    |
               [Shadow Thread - Yoga(레이아웃)]            
```

- 메시지 큐가 길어지고 우선순위가 없어 "급한 것도 줄 서야 하는" 구조
- 빠르게 스크롤/제스처 시, 중간 프레임이 비어 보이거나 늦게 그려질 수 있음

**New에서는:**

```less
[JS] ==(JSI 직접 호출·동기/비동기)==> [Native/C++ Core]
              \                         /
               \__ [Fabric/Immutable Shadow Tree] __/
```
- 직렬화/역직렬화 제거, 동기 경로 제공, 우선순위 기반 처리
- 렌더러가 여러 진행 중 트리를 다뤄 전환 중에도 프레임 안정

## 마무리

새 아키텍처는 단순한 최적화가 아니라 플랫폼·성능·개발 경험을 재설계한 변화예요.


JSI / TurboModules / Fabric / Codegen 조합으로,

- 직접 통신 + 동기 경로
- 지연 로딩과 타입 안전성
- Concurrent React 완전 지원

을 갖추게 되었고, RN은 대규모 앱에도 충분히 대응 가능한 토대를 마련했습니다.
> 결국 이 변화는 "Bridge 한계를 넘어서기 위한 새로운 기본기"라고 볼 수 있습니다.
> 이제 개발자에게 필요한 것은 새로운 아키텍처의 원리를 이해하고, 점진적으로 프로젝트에 적용하면서 React Native의 미래 흐름에 맞춰가는 것입니다.