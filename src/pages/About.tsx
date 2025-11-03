import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            О проекте
          </h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Проверяемый ГСЧ</CardTitle>
                <CardDescription>
                  Генерация случайных чисел на основе публичной энтропии
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Проект использует финализированные блоки Solana в качестве источника энтропии,
                  смешивая их с локальным шумом сервера для создания полностью прозрачного и проверяемого
                  генератора случайных чисел.
                </p>
                <p className="text-muted-foreground">
                  Каждая генерация может быть воспроизведена по drawId, что обеспечивает полную
                  прозрачность процесса.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Технологии</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Solana блокчейн для публичной энтропии</li>
                  <li>• HKDF для domain separation</li>
                  <li>• ChaCha20 для генерации потока</li>
                  <li>• Rejection sampling для равномерного распределения</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;


