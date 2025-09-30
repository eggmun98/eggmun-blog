---
title: "자바스크립트 타입에 대하여"
excerpt: "자바스크립트의 타입 시스템은 단순히 값의 분류가 아니다. 원시와 참조 타입의 차이, 암묵적 변환과 비교 연산의 함정, 그리고 래퍼 객체와 null의 역사적 유산까지 — 이 글에서는 타입 시스템을 핵심 개념부터 실무에서 자주 마주치는 함정까지 정리한다."
date: "2025-09-30"
image: "/images/component-structure.png"
tags: ["자바스크립트", "타입", "javascript", "프론트엔드", "개발 기본기", "JS 타입"]
---

## 들어가며

자바스크립트에서 타입(Type)은 단순히 값의 분류 이상의 의미를 갖습니다.

값이 어떤 타입에 속하는지에 따라 연산 방식이 달라지고, 예상치 못한 동작이나 버그로 이어질 
수도 있기 때문입니다.

프런트엔드 개발자는 매일같이 자바스크립트를 다루지만, 정작 타입 시스템을 깊게 이해하지 못하면 다음과 같은 문제에 부딪히기 쉽습니다.

- ==와 ===의 차이를 정확히 설명하지 못한다.
- undefined와 null을 혼용한다.
- Number.MAX_SAFE_INTEGER를 넘어가는 값에서 왜 오차가 생기는지 모른다.
- Truthy/Falsy 개념을 애매하게 이해해서 조건문이 의도치 않게 동작한다.

이런 지점은 실무에서 디버깅 난이도를 크게 높이고, 면접 질문에서도 자주 다뤄집니다.

결국 타입 시스템의 이해가 곧 자바스크립트 실력의 기초 체력이라고 할 수 있습니다.

이번 글에서는 자바스크립트 타입 시스템을 핵심 개념부터 실무에서 마주치는 함정까지 차근차근 정리해보겠습니다.

## 1. 원시 타입
자바스크립트에서 원시 타입(Primitive Type)은 객체가 아닌, 불변(immutable) 값입니다.
즉, 값 자체가 메모리에 직접 저장되고, 다른 변수에 할당하면 복사(copy)가 일어납니다.

### 1-1. 종류

자바스크립트는 7가지 원시 타입을 제공합니다.

- string: 문자열
- number: 정수와 부동소수 모두 포함 (IEEE 754, 64비트 부동소수점)
- bigint: 임의 정밀도의 정수 (ES2020부터 도입)
- boolean: 참/거짓
- undefined: 값이 할당되지 않은 변수의 초기 상태
- null: 의도적으로 "없음"을 표현하는 값
- symbol: 고유하고 변경 불가능한 식별자 (주로 객체 key로 사용)

### 1-2. 불변성 (Immutability)
원시 값은 불변이므로, 한 번 생성된 값을 직접 수정할 수 없습니다.
예를 들어:

```js
let str = "hello";
str[0] = "H"; 
console.log(str); // "hello"
```


문자열의 일부를 바꾸려 했지만, 원본 문자열은 변하지 않습니다.

이유는 str이 가리키는 건 값 자체이기 때문입니다.

새로운 문자열을 만들면 새로운 메모리 공간에 저장됩니다.

### 1-3. 값 복사 vs 참조

원시 타입은 할당 시 값이 복사됩니다.

```js
let a = 10;
let b = a; 
b = 20;

console.log(a); // 10
console.log(b); // 20
```
객체 타입과 달리, 원시 타입은 b를 바꿔도 a에는 영향을 주지 않습니다.


### 1-4. 흔한 함정

**undefined vs null**

```js

// undefined: 자바스크립트 엔진이 "아직 값이 없음"을 표현
// null: 개발자가 "의도적으로 비어 있음"을 표현

let x;
console.log(x); // undefined

let y = null;
console.log(y); // null
```

**숫자(Number)의 한계**

- 자바스크립트의 number는 64비트 부동소수점이므로 정밀도에 제한이 있습니다.
- Number.MAX_SAFE_INTEGER(2^53 - 1 = 9,007,199,254,740,991)를 넘어서면 안전하지 않습니다.

```js
console.log(9999999999999999); // 10000000000000000 (정밀도 깨짐)
```

이 경우 BigInt를 사용해야 합니다.

```js
const big = 9999999999999999n;
console.log(big + 1n); // 10000000000000000n
```

### 1-5. 원시 타입과 래퍼 객체 (Wrapper Objects)

자바스크립트에서 원시 타입은 객체가 아니지만, 마치 객체처럼 동작하는 순간이 있습니다.
예를 들어 문자열에서 length 프로퍼티를 읽거나, 숫자에서 메서드를 호출할 때입니다.

```js
const str = "hello";
console.log(str.length);     // 5
console.log(str.toUpperCase()); // "HELLO"
```
str은 단순한 문자열 원시값인데, 어떻게 프로퍼티와 메서드를 사용할 수 있을까요?

이는 자바스크립트가 자동으로 원시 값을 객체로 감싸는 "래퍼 객체(wrapper object)"를 생성하기 때문입니다.

- String → string 원시값을 감싸는 객체
- Number → number 원시값을 감싸는 객체
- Boolean → boolean 원시값을 감싸는 객체
- Symbol → symbol 원시값을 감싸는 객체
- BigInt → bigint 원시값을 감싸는 객체

즉, "hello".toUpperCase()가 실행되면, 엔진은 내부적으로 다음 과정을 거칩니다.

1. "hello" 원시값을 new String("hello") 형태의 임시 객체로 변환
2. 해당 객체의 toUpperCase() 메서드를 호출
3. 실행 후 임시 객체를 제거하고 결과만 반환

이 과정을 박싱(boxing)이라고 합니다.

```md
단, Symbol()·BigInt()는 new 키워드로 생성할 수 없습니다.
(new Symbol(), new BigInt() → TypeError)
필요한 경우 Object(1n)처럼 Object()를 통해 강제 박싱은 가능합니다.
```

(null과 undefined는 예외로, 대응하는 래퍼 객체가 존재하지 않습니다.)

### 1-6. typeof null === "object" 인 이유

```js
console.log(typeof null); // "object"
```

직관적으로는 "null"이 나와야 맞아 보이지만, "object"를 반환합니다.

이건 자바스크립트 초창기 설계 버그로 인한 역사적 유산입니다.

- 자바스크립트가 처음 개발될 당시(1995), 값은 내부적으로 태그 비트(tagged pointer) 방식으로 저장됐습니다.
    - 몇 비트는 타입 정보를 담고,
    - 나머지는 값(혹은 참조 주소)을 담는 구조였죠.
- 당시 객체(Object)는 타입 태그가 000으로 설정됐습니다.
- 그런데 null 값도 내부적으로 메모리에서 0x00으로 표현됐습니다.
- 결과적으로 typeof 연산자는 null과 객체(Object)를 구분하지 못하고 둘 다 "object"라고 반환하게 된 겁니다.

이미 수많은 코드와 서비스가 이 동작을 전제로 만들어졌기 때문에, 자바스크립트 표준 위원회(ECMA)는 하위 호환성을 이유로 이 버그를 수정하지 않았습니다. 그래서 오늘날까지도 남아 있습니다.

### 정리
- 원시 타입 중 string, number, boolean, symbol, bigint는 래퍼 객체가 존재해 객체처럼 동작할 수 있습니다. (null, undefined는 없음)
- typeof null === "object"는 자바스크립트 초기 설계 오류로 생긴 결과이며, 하위 호환성을 위해 유지되고 있습니다.

## 2. 참조 타입과 메모리 구조 
자바스크립트의 데이터는 크게 원시 타입(Primitive)과 참조 타입(Reference)으로 나뉩니다.

앞에서 다룬 원시 타입과 달리, 참조 타입은 메모리 저장 및 복사 방식에서 큰 차이가 있습니다.

### 2-1. 메모리 구조: Stack vs Heap

- Stack: 고정 크기를 가진 단순 값(원시 타입)의 저장소. 변수에 값 자체가 저장됩니다.
- Heap: 동적으로 크기가 변하는 값(객체, 배열, 함수 등)의 저장소. Stack에는 참조 주소(포인터)만 저장되고, 실제 값은 Heap에 존재합니다.

※ 자바스크립트 사양은 메모리 배치를 구체적으로 정의하지 않습니다. 
  “원시=스택, 객체=힙”은 일반적으로 통용되는 멘탈모델입니다.

```js
let a = { value: 10 };
let b = a;    // b는 a가 가리키는 Heap 주소를 공유

b.value = 20;
console.log(a.value); // 20 (같은 객체 참조)
```

👉 원시 타입은 값이 복사되지만, 참조 타입은 주소가 복사되어 서로 영향을 미칩니다.

### 2-2. 얕은 복사(Shallow Copy) vs 깊은 복사(Deep Copy)

- 얕은 복사: 최상위 속성만 새로 복사. 내부 객체는 여전히 같은 Heap을 참조.
- 깊은 복사: 중첩된 객체까지 새로운 메모리에 재귀적으로 복사.

```js
// 얕은 복사
let obj1 = { a: 1, b: { c: 2 } };
let obj2 = { ...obj1 };

obj2.b.c = 99;
console.log(obj1.b.c); // 99 (내부 객체는 공유됨)

// 깊은 복사
let obj3 = JSON.parse(JSON.stringify(obj1));
obj3.b.c = 42;
console.log(obj1.b.c); // 99 (완전히 분리됨)

// 단, JSON 방식은 Date/Map/Set/함수/순환참조 등에서 한계가 있음.
// 최신 환경에서는 structuredClone(obj1) 사용 권장.
```
👉 깊은 복사를 위해 structuredClone, lodash.cloneDeep 같은 유틸을 활용하기도 합니다.

### 2-3. 불변성과 사이드 이펙트

리액트 같은 라이브러리에서 불변성(immutability)을 강조하는 이유가 바로 참조 타입 때문입니다.

```js
const state = { count: 0 };

// ❌ 직접 수정 (참조 공유로 인해 사이드 이펙트 발생 가능)
state.count++;

// ✅ 새로운 객체로 업데이트
const newState = { ...state, count: state.count + 1 };
```

불변성을 유지하면:
- 상태 변경 추적이 쉬워지고,
- 예측 가능한 코드 작성이 가능하며,
- React의 리렌더링 최적화(shouldComponentUpdate, memo)가 가능해집니다.

### ✍️ 요약:

- 참조 타입은 Heap에 저장되고, 변수는 주소만 가집니다.
- 얕은 복사 vs 깊은 복사 개념을 반드시 구분해야 합니다.
- 상태 관리에서는 불변성을 지키는 것이 핵심입니다.

## 3. 타입 변환

자바스크립트의 큰 특징 중 하나는 동적 타이핑(Dynamic Typing)입니다.

즉, 변수 선언 시 타입을 지정하지 않고, 실행 시점에 값에 따라 타입이 결정됩니다.

이 과정에서 의도적/비의도적으로 타입 변환이 자주 발생합니다.

타입 변환은 크게 명시적(Explicit)과 암묵적(Implicit, Coercion) 두 가지로 나눌 수 있습니다.

### 3-1. 명시적 변환 (Explicit Conversion)

개발자가 직접 의도를 가지고 타입을 바꾸는 경우입니다.

```js
// 문자열 ↔ 숫자
Number("123");   // 123
String(123);     // "123"

// 불리언
Boolean(1);      // true
Boolean(0);      // false
Boolean("");     // false
Boolean("hi");   // true

// BigInt
BigInt("9007199254740993"); // 9007199254740993n
```

👉 parseInt, parseFloat도 있지만, 이들은 문자열을 부분적으로 해석하기 때문에 주의가 필요합니다.

```js
parseInt("123px");   // 123
Number("123px");     // NaN

// parseInt는 부분 해석 + 진법(radix)을 명시하는 것이 안전합니다.
parseInt("08", 10);  // 8
```


### 3-2. 암묵적 변환 (Implicit Conversion, Coercion)

자바스크립트 엔진이 상황에 따라 자동으로 타입을 변환하는 경우입니다.

대표적으로 산술 연산자, 비교 연산자, 문자열 연결에서 자주 일어납니다.

```js
1 + "2";       // "12" (문자열 연결)
"3" * 2;       // 6   (문자열 → 숫자)
false == 0;    // true
true + true;   // 2
```
👉 이런 암묵적 변환이 예측하기 어렵게 동작하면서 자바스크립트 특유의 함정을 만듭니다.

### 3-3. Truthy와 Falsy

조건문에서 자바스크립트는 값을 자동으로 불리언(Boolean)으로 변환합니다.

여기서 "false로 평가되는 값"을 Falsy, 그 외는 모두 Truthy라고 부릅니다.

Falsy 값

- false
- 0, -0, 0n (BigInt 0)
- "" (빈 문자열)
- null
- undefined
- NaN
- document.all

그 외 모든 값은 Truthy입니다. (예: "0", "false", [], {})

```js
if ("0") console.log("실행"); // 실행됨 (문자열 "0"은 Truthy)
if ([]) console.log("실행");   // 실행됨 (빈 배열도 Truthy)
```

### 3-4. 느슨한 비교(==) vs 엄격한 비교(===)

- == (동등 비교): 타입이 다르면 암묵적 변환 후 비교
- === (일치 비교): 타입 변환 없이 값과 타입을 동시에 비교

```js
0 == false;   // true  (false → 0 변환)
0 === false;  // false (타입이 다름)

"42" == 42;   // true  ("42" → 42 변환)
"42" === 42;  // false
```

👉 실무에서는 === 사용을 권장합니다.

(단 ==는 의도적인 경우에만, 예: x == null → x === null || x === undefined)


### 3-5. 숫자 변환에서의 주의점
```js
Number("");        // 0
Number(" ");       // 0
Number("abc");     // NaN
Number(null);      // 0
Number(undefined); // NaN
```
👉 특히 null은 숫자로 변환 시 0이 되고, undefined는 NaN이 되는 점이 자주 버그로 이어집니다.

### 3-6. 흔한 실수

NaN은 자기 자신과도 같지 않다

```
console.log(NaN === NaN); // false
```

👉 NaN을 판별할 때는 Number.isNaN(value)를 써야 합니다

```js
Number.isNaN(NaN);        // true
Number.isNaN("foo");      // false
isNaN("foo");             // true (⚠️ 암묵 변환 때문에 헷갈림)
```
또 다른 방법은 Object.is입니다.

```js
Object.is(NaN, NaN); // true
Object.is(+0, -0);   // false (===는 true)
```
👉 Object.is는 ===와 거의 동일하지만, NaN 비교 가능 + +0과 -0 구분 이라는 차이가 있습니다.

### 3-7. 실무 예제

**React 조건부 렌더링 함정**

```jsx
{items.length && <List items={items} />}
```
- items.length가 0일 때 → falsy → 0이 그대로 렌더링되어 화면에 0이 찍힘
👉 따라서 명시적으로 조건문을 써주는 게 안전합니다.

```jsx
{items.length > 0 && <List items={items} />}
```

**빈 문자열("") 문제**
```jsx
{user.name && <p>{user.name}</p>}
```
user.name = ""이면 falsy → <p> 자체가 렌더링되지 않음

👉 예상과 달리 이름이 빈 문자열일 경우 표시되지 않는 버그 발생 가능

### 정리
- 타입 변환은 명시적 vs 암묵적으로 나뉜다.
- 암묵적 변환은 편리하지만 예측하기 어려운 버그를 낳는다.
- Truthy/Falsy 규칙은 조건문에서 자주 함정을 만든다.
- ==는 암묵적 변환을 허용하므로, 실무에서는 === 사용이 안전하다.

## 4. Object와 Function의 특수성

자바스크립트에서 객체(Object)와 함수(Function)는 단순한 값 이상의 의미를 갖습니다.

원시 타입과 달리, 이들은 참조 타입으로 동작하며 다양한 특수 규칙을 가집니다.

### 4-1. 객체(Object)의 본질

- 자바스크립트의 객체는 key-value 쌍의 집합입니다.
- key는 기본적으로 문자열(string) 또는 심볼(symbol)입니다.
- 값(value)은 어떤 타입이든 올 수 있습니다.

```js
const user = {
  name: "Alice",
  age: 25,
  isAdmin: true,
};
```
👉 사실상 자바스크립트의 대부분의 구조(배열, 함수, 정규식 등)는 모두 객체 기반으로 만들어져 있습니다.

### 4-2. 배열(Array)도 사실 객체
```js
const arr = [1, 2, 3];
console.log(typeof arr); // "object"
```
- 배열은 객체의 특수한 형태입니다.
- 인덱스를 문자열 key("0", "1", ...)로 가지는 객체이고, 길이(length) 속성을 자동 관리합니다.

```js
arr["0"] === arr[0]; // true
```

### 4-3. 함수(Function)의 특수성

자바스크립트에서 함수는 일급 객체(First-class Object)입니다.

즉, 함수도 객체처럼 취급됩니다.

- 변수에 할당 가능
- 다른 함수의 인자로 전달 가능
- 함수에서 반환 가능
- 프로퍼티 추가 가능

```js
function greet() {
  console.log("hello");
}
greet.language = "English";

console.log(greet.language); // "English"
```
👉 함수는 호출 가능한(callable) 객체라고 할 수 있습니다.

### 4-4. 함수와 객체의 차이점

- 객체는 호출 불가능 → 그냥 데이터 컨테이너
- 함수는 [[Call]] 내부 메서드를 가진 객체 → 호출 가능

```js
const obj = {};
const func = function () {};

console.log(typeof obj);  // "object"
console.log(typeof func); // "function"

func(); // 실행 가능
obj();  // TypeError: obj is not a function
```

👉 함수는 사실상 Function 객체의 인스턴스이자, 내부적으로 특별한 슬롯([[Call]])을 가진 객체입니다.

### 4-5. 함수와 prototype

일반 함수는 `prototype` 프로퍼티를 가집니다.  

이는 생성자 함수로 호출될 때, 인스턴스 객체의 `__proto__`와 연결됩니다.

```js
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  console.log(`Hi, I'm ${this.name}`);
};

const p1 = new Person("Alice");
p1.sayHi(); // Hi, I'm Alice
```

👉 여기서 sayHi는 p1 자체의 속성이 아니라 Person.prototype에 정의된 메서드입니다.

즉, 프로토타입 체인(prototype chain)을 따라가며 속성을 찾는 구조.

주의: 모든 함수가 prototype을 가지는 것은 아닙니다.

생성자로 호출할 수 있는 일반 함수는 prototype을 가짐

하지만 화살표 함수, 클래스 메서드 축약 문법, 일부 내장 함수는 prototype이 없음

```js
const arrow = () => {};
console.log(arrow.prototype); // undefined

class User {
  sayHi() {} // 메서드 축약
}
console.log(User.prototype.sayHi.prototype); // undefined
```

### 4-6. 특수한 객체: 함수 vs 클래스

ES6의 class 문법도 사실은 함수 기반 문법 설탕(syntax sugar)입니다.

```js
class Animal {
  speak() {
    console.log("sound...");
  }
}
console.log(typeof Animal); // "function"
```

👉 클래스도 결국 함수 객체이고, prototype을 이용한 상속 구조를 더 깔끔하게 표현한 것뿐입니다.

### 4-7. 흔한 실수

배열을 객체처럼 사용하기

```js
const arr = [];
arr["foo"] = 123;

console.log(arr.length); // 0
console.log(arr.foo);    // 123
```


👉 배열에 문자열 key를 넣으면, 배열 길이(length)와는 무관한 일반 객체 속성이 됩니다.

따라서 배열은 순서 있는 데이터 컬렉션에만 쓰고, 키-값 저장은 객체(Map/Set)를 쓰는 게 맞습니다.

### 정리

- 자바스크립트에서 객체는 모든 것의 기반 구조다.
- 배열도 사실 객체이며, key는 문자열로 관리된다.
- 함수는 호출 가능한 특별한 객체(일급 객체)이며, 프로퍼티를 가질 수도 있다.
- 클래스는 함수의 문법 설탕(syntax sugar)일 뿐, 본질적으로 함수와 프로토타입 기반 상속에 의존한다.
- 배열을 객체처럼 쓰는 건 흔한 실수 → Map/Set이 적합하다.


## 5. 타입 확인 (Type Checking)
자바스크립트는 동적 타입 언어이므로, 실행 중에 값의 타입을 확인해야 하는 경우가 많습니다.

예를 들어 API 응답 값이 기대한 형태인지, 함수 매개변수가 올바른 타입인지 검증하는 상황이 대표적입니다.

타입 확인에는 여러 가지 방법이 있으며, 각 방식은 장단점이 있습니다.


### 5-1. typeof 연산자

가장 기본적인 타입 확인 연산자.

원시 타입 확인에는 적합하지만, 객체/배열/함수 구분에는 한계가 있습니다.

```js
typeof 42;          // "number"
typeof "hi";        // "string"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof Symbol();    // "symbol"
typeof 10n;         // "bigint"

typeof {};          // "object"
typeof [];          // "object"  ❌ 배열 구분 불가
typeof null;        // "object"  ❌ 역사적 버그
typeof function(){} // "function"
```
👉 null과 배열을 구분하지 못하는 점은 큰 제약입니다.

### 5-2. instanceof 연산자

객체가 특정 생성자 함수(또는 클래스)의 인스턴스인지 확인.

프로토타입 체인을 따라 검사합니다.

```js
[] instanceof Array;        // true
({}) instanceof Object;       // true
function f(){} 
f instanceof Function;      // true
```

⚠️ 단, 다른 프레임(iframe, worker 등)에서 생성된 객체는 instanceof가 실패할 수 있습니다.

```js
// iframe에서 넘어온 Array는 instanceof Array === false
```

### 5-3. Array.isArray

배열 판별에는 표준 메서드인 Array.isArray를 사용하는 것이 가장 안전합니다.

```js
Array.isArray([]);   // true
Array.isArray({});   // false
```

### 5-4. Object.prototype.toString

내부 [[Class]] 속성을 기반으로 타입을 문자열로 반환하는 고전적 방법.
모든 타입을 정밀하게 확인할 수 있습니다.

```js
Object.prototype.toString.call([]);        // "[object Array]"
Object.prototype.toString.call({});        // "[object Object]"
Object.prototype.toString.call(null);      // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(42);        // "[object Number]"
```

### 5-5. 사용자 정의 타입 가드

특정 값이 객체 형태를 따르는지 확인할 때는 직접 함수로 구현하기도 합니다.

```js
function isUser(obj) {
  return obj &&
         typeof obj.name === "string" &&
         typeof obj.age === "number";
}
const u = { name: "Alice", age: 20 };
console.log(isUser(u)); // true
```




### 5-6. 실무에서의 활용

- API 응답 검증: 런타임에 타입 검사를 추가 (예: zod, yup 같은 검증 라이브러리)
- 함수 인자 방어적 코드: 예상 타입이 아니면 에러 throw
- 타입스크립트와 병행: TS는 컴파일 타임 검증, 런타임은 위와 같은 체크 필요

### 정리
- typeof: 원시 타입 확인에 적합, 하지만 배열/null 구분 불가.
- instanceof: 프로토타입 기반 판별, 다른 실행 컨텍스트(iframe 등)에서는 신뢰도 낮음.
- Array.isArray: 배열 판별의 표준 방법.
- Object.prototype.toString: 가장 정밀한 판별, 라이브러리에서 자주 활용.
- 복잡한 구조는 직접 타입 가드 함수를 만들거나 런타임 검증 라이브러리 사용.


## 6. 동등성 비교와 일치성

자바스크립트에서 값을 비교할 때는 세 가지 주요 연산자를 사용합니다.

- == (동등, loose equality)
- === (일치, strict equality)
- Object.is (동일성, identity)

이 세 가지는 겉보기엔 비슷하지만, 타입 변환 규칙과 특별 케이스에서 차이가 납니다.

### 6-1. 동등 비교 (==)

타입이 다르면 암묵적 변환을 거친 후 비교합니다.

예측하기 어렵고 버그를 만들기 쉬움.

```js
console.log(0 == false);   // true  (false → 0)
console.log("42" == 42);   // true  ("42" → 42)
console.log(null == undefined); // true (특수 규칙)
```

👉 예외적으로 x == null (null 또는 undefined 동시 체크) 정도 활용될 수 있습니다.

그 외에는 지양하는 것이 일반적입니다.

### 6-2. 일치 비교 (===)

타입 변환 없이 값과 타입을 동시에 비교합니다.

```js
console.log(0 === false);   // false (타입 다름)
console.log("42" === 42);   // false
console.log(null === undefined); // false
```

### 6-3. Object.is

ES6에서 도입된 비교 연산으로, ===와 거의 같지만 몇 가지 특별한 케이스에서 다릅니다.

```js
console.log(Object.is(0, -0));     // false
console.log(0 === -0);             // true

console.log(Object.is(NaN, NaN));  // true
console.log(NaN === NaN);          // false
```

👉 따라서 Object.is는 NaN 판별과 0/-0 구분에 유용합니다.

### 6-4. 정리

![자바스크립트 값과 타입의 비교 방법](https://velog.velcdn.com/images/eggmun22/post/5560dfcc-7f31-44d9-8bc1-20171d87d25d/image.png)


### 마무리

자바스크립트의 타입 시스템은 단순히 값을 구분하는 기준이 아니라,

코드의 동작 방식과 안정성까지 좌우하는 중요한 개념입니다.

이번 글에서 다룬 핵심은 다음과 같습니다.

**원시 타입 vs 참조 타입**
- → 값이 직접 복사되는지, 참조 주소가 공유되는지 차이를 이해해야 함.

**래퍼 객체와 typeof null**
- → 원시 타입이 객체처럼 동작하는 이유와, typeof null === "object"라는 역사적 유산.

**타입 변환**
- → 명시적 변환은 의도를 드러내는 방법, 암묵적 변환은 예상치 못한 결과를 만들 수 있음.

**객체 타입**
- → 배열, 함수, 객체는 모두 Object 기반이지만 각기 다른 특성과 활용법을 가짐.

**동등성 비교**
- → ==는 암묵적 변환을 허용해 혼란을 만들 수 있으므로, ===와 Object.is의 차이를 이해하고 쓰는 게 중요함.


프레임워크나 라이브러리가 많은 부분을 추상화해주더라도,

자바스크립트의 타입 체계를 깊이 이해하면 예측 가능한 코드를 작성할 수 있습니다.

앞으로도 이런 기본기를 반복해서 다지고,

"왜 이렇게 동작하는지"를 스스로 설명할 수 있는 수준까지 익혀 두는 게 중요합니다.