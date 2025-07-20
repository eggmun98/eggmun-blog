import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Code, Coffee, Book, Music, Mountain, Dumbbell } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "ReactNative"
  ]

  const interests = [
    { name: "개발", icon: Code, description: "깊게 공부하고 라이브러리 제작" },
    { name: "헬스", icon: Dumbbell, description: "몸을 키우는 웨이트 트레이닝" },
    { name: "클라이밍", icon: Mountain, description: "볼더링 문제를 푸는 클라이밍" },
    { name: "음악", icon: Music, description: "다양한 장르의 음악 감상" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6">
              <Image 
                src="/images/munSeongJin.jpeg" 
                alt="문성진 프로필" 
                width={128} 
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-4xl font-bold text-foreground">안녕하세요! 👋</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            기술의 본질을 탐구하며, 개발 자체를 좋아하는 개발자입니다.
            </p>
          </section>

          {/* Basic Info */}
          <section>
            <h2 className="text-2xl font-bold mb-6">기본 정보</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">위치</p>
                      <p className="text-muted-foreground">성남, 대한민국</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">경력</p>
                      <p className="text-muted-foreground">3년차 개발자</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-bold mb-6">기술 스택</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Interests */}
          <section>
            <h2 className="text-2xl font-bold mb-6">관심사</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interests.map((interest) => {
                const Icon = interest.icon
                return (
                  <Card key={interest.name}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{interest.name}</h3>
                          <p className="text-muted-foreground text-sm">{interest.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* About Blog */}
          <section>
            <h2 className="text-2xl font-bold mb-6">이 블로그에 대해</h2>
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    이 블로그는 개발하면서 배운 것들, 일상에서 느낀 점들, 그리고 관심 있는 주제들에 대한 생각을 정리하고
                    공유하는 공간입니다. 주로 웹 개발과 앱 개발에 관한 내용들을 다루지만, 때로는 개발과 관련
                    없는 일상적인 이야기들도 함께 기록합니다.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    글을 통해 배운 것들을 정리하고, 다른 개발자들과 소통하며 함께 성장해나가고 싶습니다. 궁금한 점이나
                    피드백이 있으시면 언제든 댓글이나 이메일로 연락해주세요!
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
