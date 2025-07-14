"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Bell, ArrowLeft, Check, X, Sun, Moon, RotateCcw, Award, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Importar Dexie e hooks
import { db, type ReadingEntry, type UserSettings } from "@/lib/db"
import { useLiveQuery } from "dexie-react-hooks"

// Dados estáticos dos pergaminhos
const staticScrolls = [
  {
    id: 10,
    title: "Orarei por orientação",
    preview:
      "Quem sou eu para saber todos os planos? De hoje em diante, orarei por orientação. Jamais orarei por bens materiais; orarei por direção para alcançar êxito, saúde e felicidade.",
    image: "/images/perg10.png",
    fullText: `Orarei por orientação.

Quem sou eu para saber todos os planos?

De hoje em diante, orarei por orientação.

Jamais orarei por bens materiais, nem orarei por êxito, saúde ou felicidade. Em vez disso, orarei por orientação para que me mostre o caminho que devo seguir a fim de alcançá-los.

Orarei por orientação.

Orarei para que as palavras que eu pronunciar sejam corretas. Orarei para que os passos que eu der sejam os certos. Orarei para que as ações que eu realizar tragam êxito e felicidade.

Orarei por orientação.

E como enfrentarei cada dia? Com oração.

Orarei por orientação.

E como enfrentarei cada obstáculo? Com oração.

Orarei por orientação.

E como enfrentarei cada fracasso? Com oração.

Orarei por orientação.

E como enfrentarei cada sucesso? Com oração.

Orarei por orientação.

E como enfrentarei meus inimigos? Com oração.

Orarei por orientação.

E como enfrentarei meu trabalho? Com oração.

Orarei por orientação.

E como enfrentarei meu destino? Com oração.

Orarei por orientação.

De hoje em diante, recordarei este segredo: a oração é a melhor forma de buscar orientação.

Orarei por orientação.

E deste momento em diante, aprenderei este segredo: a oração é a chave para alcançar o sucesso.

Orarei por orientação e terei êxito.`,
  },
  {
    id: 1,
    title: "Hoje começo uma nova vida",
    preview:
      "Hoje mudo minha pele velha que sofreu, por muito tempo, as machucaduras do fracasso e os ferimentos da mediocridade...",
    image: "/images/perg1.png",
    fullText: `Hoje começo uma nova vida.

Hoje mudo minha pele velha que sofreu, por muito tempo, as machucaduras do fracasso e os ferimentos da mediocridade.

Hoje renasço e meu berço é uma vinha onde há frutas para todos.

Hoje colherei uvas de sabedoria da mais alta e carregada videira da vinha, pois elas foram plantadas pelos mais sábios de minha profissão, que me antecederam, geração após geração.

Hoje provarei o sabor das uvas destas videiras e, em verdade, engolirei a semente do êxito incrustada em cada uva e uma nova vida brotará dentro de mim.

A carreira por mim escolhida é plena de oportunidades, embora repleta de desgosto e desespero, e se os corpos daqueles que fracassaram fossem empilhados um em cima do outro, lançariam sua sombra sobre todas as pirâmides da Terra. Contudo, eu não fracassarei como os outros, pois em minhas mãos tenho agora o mapa que me guiará por águas perigosas às costas que, ontem mesmo, pareceriam apenas um sonho.

O fracasso não mais será o tributo da minha luta. Assim como a natureza não preparou meu corpo para tolerar a dor, também não determinou que minha vida sofra o fracasso. O fracasso, como a dor, é elemento estranho à minha vida. No passado eu o aceitei, como aceitei a dor. Agora eu o rejeito e estou preparado pela sabedoria e os princípios que me guiarão das sombras para a luz da riqueza, das posições e da felicidade, bem além dos meus sonhos mais extravagantes, quando até mesmo as maçãs douradas do jardim de Hespérides não me parecerão mais que minha justa recompensa.

O tempo ensina todas as coisas àquele que vive para sempre, mas não tenho o luxo da eternidade.

Contudo, dentro do tempo que me foi concedido, vejo-me na obrigação de praticar a paciência, pois a natureza jamais age apressadamente. Para criar a oliveira, rainha de todas as árvores, cem anos são necessários. Em nove semanas a cebola já está velha. Eu vivo como uma cebola e isto não me agrada. Agora, tornar-me-ei na maior das oliveiras e, em verdade, no maior dos vendedores.

E como se realizará isto? Pois não tenho nem o conhecimento, nem a experiência para alcançar grandeza, já tropeço na ignorância e caio nas águas da lamúria. A resposta é simples: começarei a minha jornada desembaraçado do peso de conhecimentos desnecessários e de obstáculos da experiência sem significado. A natureza sempre me forneceu conhecimento e instinto maior do que qualquer animal da floresta, superior até mesmo ao valor da experiência, em geral superestimado por velhos que parecem sábios, mas falam tolices.

Em verdade, a experiência ensina completamente, porém seu curso de instrução devora os anos dos homens e dessa maneira o valor de suas lições diminui com o tempo necessário para adquirir-se sua sabedoria especial. Seu objetivo desperdiça-se com homens moribundos. Ademais, a experiência é comparável à moda; uma ação que resulta em êxito hoje será inaproveitável e impraticável amanhã.

Apenas princípios permanecem e estes eu agora possuo, pois as leis que me levarão à grandeza estão contidas nas palavras dos pergaminhos. O que eles ensinarão será mais evitar o fracasso do que obter êxito, pois o que é o êxito senão um estado de espírito? Dois, entre mil sábios, se tanto, definirão o êxito nas mesmas palavras, enquanto o fracasso é sempre descrito de apenas um modo. O fracasso é a incapacidade do homem em atingir seus objetivos na vida, sejam eles quais forem.

Na verdade, a única diferença entre aqueles que falharam e aqueles que tiveram sucesso está na diferença de seus hábitos. Bons hábitos são a chave do sucesso e maus hábitos são a porta aberta para o fracasso. Assim, a primeira lei que obedecerei é: Formarei bons hábitos e me tornarei escravo deles.

Quando criança, fui escravo de meus impulsos; agora sou escravo de meus hábitos, como todos os adultos. Rendi minha vontade própria aos anos de hábitos acumulados e os últimos feitos de minha vida já traçam um caminho que ameaça aprisionar meu futuro. Minhas ações são ditadas pelo apetite, paixão, preconceito, avidez, amor, medo, ambiente, hábito, e o pior de todos estes tiranos é o hábito.

Portanto, devo ser escravo do hábito, que seja um escravo de bons hábitos. Meus maus hábitos devem ser destruídos e novos sulcos preparados para boas sementes. Eu formarei bons hábitos e me tornarei escravo deles.

E como realizarei esse difícil feito? Através destes pergaminhos, pois cada um deles contém um princípio que expulsará o mau hábito de minha vida e nela recolocará outro que me aproximará do êxito, pois é outra das leis naturais que apenas um hábito pode dominar outro hábito. Assim, para que estas palavras escritas realizem a tarefa escolhida, devo disciplinar-me ao seguinte, que é o primeiro de meus hábitos:

Eu lerei cada pergaminho por trinta dias seguidos, da maneira prescrita, antes de passar ao pergaminho seguinte.

Primeiro, lerei as palavras em silêncio, ao levantar. Depois, lerei em silêncio, após almoçar. Finalmente, lerei de novo, antes de retirar-me para o leito e, mais importante, nesta ocasião lerei em voz alta.

No dia seguinte, repetirei o processo e continuarei dessa maneira por trinta dias. Tomarei então, o pergaminho seguinte e repetirei esse processo por outros trinta dias. Continuarei assim até viver com cada pergaminho por trinta dias, e minha leitura se tornará um hábito.

E o que será realizado com este hábito? Aqui está o segredo oculto das realizações de todos os homens. Com a repetição das palavras diariamente, elas logo se tornarão parte da minha mente ativa, porém, mais importante também se infiltrarão em minha outra mente, essa misteriosa fonte que nunca dorme, que cria meus sonhos e frequentemente me faz agir de maneiras que eu não compreendo.

Assim que as palavras destes pergaminhos forem consumidas pela minha mente misteriosa, eu começarei a despertar a cada manhã com uma vitalidade que jamais conheci antes. Meu vigor aumentará, meu entusiasmo se levantará, meu desejo de encontrar o mundo vencerá todo o medo que um dia conheci ao nascer do sol e serei mais feliz do que jamais acreditei ser possível neste mundo de luta e tristeza.

Finalmente, encontrar-me-ei reagindo em todas as situações que confrontar, como foi ordenado nos pergaminhos e logo, essas ações e reações se tornarão fáceis de executar, pois cada ato com a prática, torna-se fácil.

Assim, nasce um novo e bom hábito, pois quando um hábito se torna fácil, através de constante repetição, se é um prazer executá-lo é da natureza do homem executá-lo frequentemente. Quando eu o executo frequentemente ele se torna um hábito e eu me torno seu escravo; e desde que seja um hábito é a minha vontade.

Hoje começo uma nova vida.

Juro solenemente a mim mesmo que nada retardará o crescimento de minha nova vida. Não perderei um dia sequer destas leituras, pois este dia não pode ser recuperado nem posso substituí-lo por outro. Não devo, não quero quebrar o hábito de ler diariamente estes pergaminhos e, em verdade, os poucos momentos passados cada dia com este hábito são apenas um pequeno preço a pagar pela felicidade e êxito que serão meus.

Ao ler e reler as palavras dos pergaminhos a serem obedecidas, nunca permitirei que a brevidade ou a simplicidade de sua palavras me faça encarar a mensagem como se fosse superficial. Milhares de uvas são amassadas para encher uma jarra de vinho, e sua casca e polpa ainda são bicadas pelos pássaros.

Assim é com estas uvas de sabedoria das gerações. Muito tem sido filtrado e abalado pelo vento, apenas a verdade pura permanece destilada nas palavras, para ser lembrada. Beberei segundo as instruções e não perderei uma só gota, e engolirei a semente do êxito.

Hoje minha pele velha se assemelha a poeira. Andarei a prumo entre os homens e eles não me reconhecerão, pois hoje sou um novo homem, com uma vida nova.`,
  },
  {
    id: 2,
    title: "Saudarei este dia com amor no coração",
    preview:
      "Pois este é o maior segredo do êxito em todas as aventuras. Os músculos podem partir um escudo e até destruir a vida, mas apenas os poderes invisíveis do amor...",
    image: "/images/perg2.png",
    fullText: `Saudarei este dia com amor no coração.

Pois este é o maior segredo do êxito em todas as aventuras. Os músculos podem partir um escudo e até destruir a vida, mas apenas os poderes invisíveis do amor podem abrir os corações dos homens e até dominar esta arte, não serei mais que um mascate na feira. Farei do amor minha maior arma e ninguém que enfrente poderá defender-se de sua força.

Podem opor-se ao meu raciocínio, desconfiar de minhas apregoações; podem desaprovar meus trajes; podem rejeitar meu rosto; e podem até suspeitar de meus negócios; contudo, meu amor enternecerá todos os corações, comparável ao sol cujos raios suavizam o mais frio barro.

Saudarei este dia com amor no coração.

E como o farei? De hoje em diante olharei todas as coisas com amor e renascerei. Amarei o sol porque aquece os meus ossos; não obstante, amarei a chuva porque purifica o meu espírito; amarei a luz porque me mostra o caminho; não obstante, amarei a escuridão porque me faz ver as estrelas. Eu receberei a felicidade porque ela engrandece o meu coração; não obstante, tolerarei a tristeza porque abre a minha alma e aceitarei prêmios porque são minhas recompensas; não obstante, receberei de bom grado os obstáculos, porque eles são o meu desafio.

Saudarei este dia com amor no coração.

E como falarei? Enaltecerei meus inimigos e eles se tornarão amigos. Encorajarei meus amigos e eles se tornarão irmãos. Cavarei fundo, buscando razões para aplaudir, jamais arranjarei justificativas para maldizer. Quando tentado a criticar, morderei a língua; quando me decidir a elogiar alguém, falarei alto acima dos tetos.

Não é assim que os pássaros, o vento, o mar e toda a natureza falam com a música de louvor pelo seu criador? De hoje em diante relembrarei este segredo e mudarei minha vida.

Saudarei este dia com amor no coração.

E como agirei? Amarei todos os comportamentos dos homens, pois cada um tem qualidades para ser admirado, mesmo se estiverem ocultas. Com amor derrubarei o muro da suspeita e ódio que construíram em volta dos corações e, em seu lugar, construirei pontes para que meu amor possa entrar em suas almas.

Amarei as ambições, pois elas podem inspirar-me; amarei os fracassos, pois eles podem ensinar-me; amarei os reis, pois eles são apenas humanos; amarei os humildes, pois eles são filhos de Deus; amarei os ricos, pois eles são, não obstante, solitários; amarei os pobres, pois eles são muitos; amarei os jovens pela fé que têm; amarei os velhos, pela sabedoria que partilham; amarei os formosos, por seu olhar de tristeza; amarei os feios, por suas almas de paz.

Saudarei este dia com amor no coração.

Mas como reagirei às reações dos outros? Com amor. Pois, sendo a minha arma para abrir os corações dos homens, o amor é também o meu escudo para repelir as setas do ódio e as lanças da ira. A adversidade e o desencorajamento se chocarão contra meu novo escudo e se tornarão como as chuvas mais brandas. Meu escudo me protegerá na feira e me sustentará quando sozinho. Ele me reanimará em momentos de desespero e, contudo, me acalmará na exultação. Tornar-me-ei mais forte e mais protegido usando-o até o dia em que ele seja parte de mim, e andarei desembaraçado entre todos os comportamentos dos homens e meu nome se erguerá alto na pirâmide da vida.

Saudarei este dia com amor no coração.

E como enfrentarei cada um que encontrar? De apenas um modo. Em silêncio, e para mim mesmo, dir-lhe-ei: "Eu amo Você." Embora ditas em silêncio, estas palavras brilharão em meus olhos, desenrugarão minha fronte, trarão um sorriso a meus lábios e ecoarão em minha voz; e o coração dele se abrirá. E quem dirá não às minhas mercadorias quando seu coração sente meu amor?

Saudarei este dia com amor no coração.

E acima de tudo amarei a mim mesmo, pois quando o fizer, zelosamente, inspecionarei todas as coisas que entraram em meu corpo, minha mente, minha alma e meu coração. Jamais abusarei das solicitações da carne, mas sobretudo, cuidarei de meu corpo com asseio e moderação. Jamais permitirei que minha mente seja atraída para o mal e o desespero, mas sobretudo a elevarei com o conhecimento e a sabedoria das gerações. Jamais permitirei que minha alma se torne complacente e satisfeita, mas compartilhá-lo-ei e ele crescerá e aquecerá a Terra.

Saudarei este dia com amor no coração.

De hoje em diante amarei a humanidade. Deste momento em diante todo o ódio desaparece de minhas veias, pois não tenho tempo para odiar, apenas para amar. Deste momento em diante dou o primeiro passo necessário para me tornar um homem entre homens. Com amor, aumentarei minhas vendas em cem vezes mais e me tornarei um grande vendedor. Se nenhuma outra qualidade possuo, posso ter êxito apenas com amor. Sem ele eu fracassarei, embora possua todo o conhecimento e as técnicas do mundo.

Eu saudarei este dia com amor e terei êxito.`,
  },
  {
    id: 3,
    title: "Persistirei até alcançar êxito",
    preview:
      "No Oriente, os touros jovens são testados para o combate na arena de um modo apropriado. São levados um a um para a arena, e permite-se que ataquem o picador...",
    image: "/images/perg3.png",
    fullText: `Persistirei até alcançar êxito.

No Oriente, os touros jovens são testados para o combate na arena de um modo apropriado. São levados um a um para a arena, e permite-se que ataquem o picador que os provoca com uma lança. A bravura de cada touro é então avaliada com cuidado segundo o número de vezes que demonstra persistência para investir apesar da ferroada da lâmina, portanto, de hoje em diante reconhecerei que cada dia sou testado pela vida do mesmo modo. Se persisto, se continuo a tentar, se continuo a investir, terei êxito.

Persistirei até alcançar êxito.

Eu não cheguei a este mundo numa situação de derrota, nem o fracasso corre em minhas veias. Não sou ovelha à espera de que meu pastor me aguilhoe e acaricie, mas um leão e me recuso a falar, andar e dormir como uma ovelha. Não ouvirei aqueles que choram e se queixam, pois tal doença é contagiosa.

Eles que se unjam à ovelha. O matadouro do fracasso não é o meu destino.

Persistirei até alcançar êxito.

Os prêmios da vida estão no fim de cada jornada, não próximos do começo; não me é dado saber quantos passos são necessários a fim de alcançar o objetivo. O fracasso pode ainda se encontrar no milésimo passo, mas o sucesso se esconde atrás da próxima curva da estrada. Jamais saberei a que distância está, a não ser que dobre a curva. Sempre darei um passo avante. Se este não resultar em nada, darei outro e mais outro. Em verdade, dar um passo de cada vez não é difícil.

Persistirei até alcançar êxito.

De hoje em diante, considerarei o esforço de cada dia como um golpe do meu machado no poderoso carvalho. O primeiro golpe pode não causar tremor na madeira, nem o segundo e nem o terceiro. Cada golpe pode parecer insignificante e sem nenhuma consequência. Contudo, a custo de infantis golpes o carvalho finalmente tombará. Assim também será com os esforços de hoje.

Sou comparável a uma gota de chuva que lava a montanha; a formiga que devora o tigre; à estrela que ilumina a Terra; ao escravo que constrói uma pirâmide. Construirei o meu castelo com um tijolo de cada vez, pois sei que pequenas tentativas repetidas completarão qualquer empreendimento.

Persistirei até alcançar êxito.

Jamais aceitarei a derrota e retirarei de meu vocabulário palavras e expressões como "desistir", "não posso", "incapaz", "impossível", "fora de cogitação", "improvável", "fracasso", "impraticável", "sem esperança" e "recuo", pois são palavras e expressões de tolos. Evitarei o desespero, mas se essa doença da mente me contagiar, então prosseguirei, mesmo em desespero. Trabalharei firme e permanecerei. Ignorarei os obstáculos sobre os meus pés e manterei meus olhos firmes nos objetivos acima de minha cabeça, pois sei que onde um deserto árido termina a grama verde nasce.

Persistirei até alcançar êxito.

Eu me lembrarei das velhas leis comuns e as usarei em meu benefício. Persistirei com o conhecimento de que cada fracasso em vender aumentará minha oportunidade de êxito na tentativa seguinte. Cada "não" que ouvir me trará para junto do som do "sim". Cada sobrolho franzido que encontrar apenas me preparará para o sorriso que chega. Cada infortúnio com que deparar trará consigo a semente da sorte do amanhã. Eu preciso da noite para apreciar o dia. Devo fracassar muito para alcançar o sucesso definitivo.

Persistirei até alcançar êxito.

Tentarei e tentarei e tentarei de novo. Cada obstáculo, considerarei como um mero atraso em relação ao meu objetivo e um desafio à minha profissão. Persistirei e desenvolverei minhas técnicas como um marinheiro desenvolve a sua, aprendendo a escapar da ira de cada tempestade.

Persistirei até alcançar êxito.

De hoje em diante, aprenderei e aplicarei outro segredo importante para o sucesso do meu trabalho. Ao findar de cada dia, independente de êxito ou fracasso, tentarei efetuar mais uma venda. Quando os meus pensamentos acenarem com o caminho de casa ao meu corpo cansado, resistirei à tentação de partir.

Tentarei novamente, farei uma tentativa mais para fechar com vitória e, se fracassar, farei outra. Jamais permitirei que o dia termine com um fracasso. Assim plantarei a semente do êxito de amanhã e ganharei uma insuperável vantagem sobre aqueles que interrompem o trabalho a uma determinada hora. Quando outros interrompem suas lutas, então a minha começará e minha colheita será plena.

Persistirei até alcançar êxito.

Não permitirei que o êxito de ontem me embale na complacência de hoje, pois essa é a grande razão do fracasso. Esquecerei os acontecimentos do dia anterior, sejam eles bons ou maus, e saudarei o novo sol com a confiança de que este será o melhor dia de minha vida.

Até onde o fôlego me acompanhar, persistirei. Pois agora conheço um dos maiores princípios do êxito; se persisto o bastante, vencerei.

Eu persistirei.

Eu vencerei.`,
  },
  {
    id: 4,
    title: "Eu sou o maior milagre da natureza",
    preview:
      "Desde o princípio do mundo nunca houve outro com a minha mente, meu coração, meus olhos, meus ouvidos, minhas mãos, meu cabelo, minha boca...",
    image: "/images/perg4.png",
    fullText: `Eu sou o maior milagre da natureza.

Desde o princípio do mundo nunca houve outro com a minha mente, meu coração, meus olhos, meus ouvidos, minhas mãos, meu cabelo, minha boca. Nenhum outro caminha, fala, move-se e pensa exatamente como eu.

De todos os que vivem neste mundo, nenhum é idêntico a mim. Sou uma criatura única.

Eu sou o maior milagre da natureza.

Embora eu seja, de fato, o maior milagre da natureza, não sou um grão de areia jogado ao vento, para que este me arraste segundo sua vontade. Sou uma maravilha da natureza e a natureza não sabe de derrota.

Desde que há vida, seu objetivo tem sido a vitória sobre todas as adversidades. Sou único e não comecei na pobreza, nem na derrota, nem no fracasso. Desde o sangue de meus antepassados até o meu nascimento, houve uma contínua corrente, cujo fluxo nunca foi interrompida e que correu por incontáveis gerações até chegar a mim.

De hoje em diante, aproveitarei esta herança de êxito, pois ela é minha. Jamais permitirei que o ontem roube o meu hoje e destruirei o desespero no meu nascimento, nascido do fracasso do passado. Não sou escravo do ontem.

Eu sou o maior milagre da natureza.

Eu sou único. Sou uma criatura rara. Sou novo entre todas as coisas criadas. E sou valioso. Sou a manifestação da natureza, e a natureza não conhece fracasso. Portanto, o fracasso é estranho a minha vida. No passado aceitei-o como aceitei a dor. Agora rejeito-o e estou preparado para a sabedoria e os princípios que me guiarão das sombras para a luz da riqueza, das posições e da felicidade.

Eu sou o maior milagre da natureza.

A natureza não conhece derrota. Ela triunfa e eu triunfarei. Eu sou único. Um entre todos os seres vivos. Não sou ovelha à espera de que meu pastor me aguilhoe e acaricie, mas um leão e me recuso a falar, andar e dormir como uma ovelha.

Eu sou o maior milagre da natureza.

De hoje em diante, proclamarei minha singularidade ao mundo. Não tentarei imitar os outros; em vez disso, exibirei minha singularidade em meu trabalho. Não serei mais um vendedor entre milhares de outros vendedores. Sou único e, portanto, serei o melhor.

Eu sou o maior milagre da natureza.

Aumentarei meu valor por cem vezes. Estabelecerei objetivos para mim mesmo e os alcançarei. Sempre anunciarei meus objetivos ao mundo. Contudo, jamais revelarei o meu preço, pois este será elevado o bastante para afastar-me da competição.

Eu sou o maior milagre da natureza.

Eu sou raro e há valor em toda raridade; portanto, sou valioso. Sou o produto final de milhares de anos de evolução; portanto, sou melhor equipado para atingir êxito do que todos os imperadores e sábios que me antecederam.

Eu sou o maior milagre da natureza.

De hoje em diante, concentrarei todos os meus esforços em ser melhor que ontem. Os resultados serão proporcionais ao esforço que aplicar. A árvore que cresce altiva e forte depende do solo e do sol. Eu também preciso de alimento e estímulo para alcançar êxito.

Eu sou o maior milagre da natureza.

Jamais aceitarei a derrota. Jamais aceitarei o fracasso. Jamais aceitarei a mediocridade. Sou único e, como tal, serei sempre o melhor.

Eu sou o maior milagre da natureza.

De hoje em diante, aproveitarei ao máximo minha singularidade. Eu sou raro e há valor em toda raridade.

Sou o maior milagre da natureza.`,
  },
  {
    id: 5,
    title: "Viverei este dia como se fosse o último",
    preview:
      "De hoje em diante, tratarei este dia como o último da minha vida. Que farei então com este último dia de valor inestimável que me resta...",
    image: "/images/perg5.png",
    fullText: `Viverei este dia como se fosse o último.

De hoje em diante, tratarei este dia como o último da minha vida. Que farei então com este último dia de valor inestimável que me resta? Primeiramente, selarei o conteúdo do meu passado para que não me envergonhe ou me desespere. O passado não deve ser mais do que um sonho que não pode ser alterado ou corrigido. Não permitirei que o ontem roube o meu hoje.

Viverei este dia como se fosse o último.

O futuro também é um tempo que não me pertence. Não posso viver o amanhã. O amanhã sempre estará à minha frente, esperando que eu o alcance, mas nunca poderei alcançá-lo.

Viverei este dia como se fosse o último.

Este dia é tudo o que tenho e estas horas são minha eternidade. Saúdo este amanhecer com lágrimas de alegria como um prisioneiro que é libertado da morte. Levanto minhas mãos em agradecimento por esta dádiva única.

Viverei este dia como se fosse o último.

De hoje em diante, olharei cada dia como o último da minha vida. E que farei com este último dia? Abraçarei cada minuto deste dia com gratidão e alegria. Trabalharei mais arduamente do que nunca. Cumprirei minhas tarefas como se fossem as últimas que eu realizasse. E farei com que cada hora seja mais produtiva do que a hora anterior.

Viverei este dia como se fosse o último.

E se não for? Eu cairei de joelhos e darei graças.

Viverei este dia como se fosse o último e terei êxito.`,
  },
  {
    id: 6,
    title: "Hoje serei o mestre das minhas emoções",
    preview:
      "As marés avançam; as marés recuam. O inverno vai e o verão chega. O verão se esvai e o frio aumenta. A lua aparece; a lua desaparece...",
    image: "/images/perg6.png",
    fullText: `Hoje serei o mestre das minhas emoções.

As marés avançam; as marés recuam. O inverno vai e o verão chega. O verão se esvai e o frio aumenta. A lua aparece; a lua desaparece. Todos os aspectos da natureza têm suas estações e os homens também têm suas próprias emoções.

Hoje serei o mestre das minhas emoções.

É uma das maravilhas da natureza que as sementes da tristeza não possam crescer em terrenos de alegria. Assim como o solo, a mente só pode nutrir uma emoção de cada vez.

Hoje serei o mestre das minhas emoções.

E como dominarei minhas emoções para que todo o dia seja produtivo? Se eu sentir depressão, cantarei. Se eu sentir tristeza, rirei. Se eu sentir dor, aumentarei meu trabalho. Se eu sentir medo, avançarei. Se eu sentir incerteza, erguerei minha voz. Se eu sentir pobreza, pensarei na riqueza futura. Se eu sentir incompetência, recordarei êxitos passados. Se eu sentir insignificância, recordarei meus objetivos.

Hoje serei o mestre das minhas emoções.

E como dominarei as mudanças do tempo? Se me sentir confiante, controlarei minha confiança. Se me sentir exuberante, controlarei meu comportamento. Se me sentir enraivecido, controlarei minha língua. Se me sentir exaltado, controlarei minhas ações. Se me sentir complacente, recordarei minhas falhas.

Hoje serei o mestre das minhas emoções.

De hoje em diante, reconhecerei e identificarei os mistérios das estações da minha vida. E aceitarei cada mudança como natural.

Hoje serei o mestre das minhas emoções.

E com este novo conhecimento enfrentarei todos os homens e todas as situações com a calma que nasce da sabedoria.

Hoje serei o mestre das minhas emoções.

E deste momento em diante, aprenderei este segredo: fraqueza emocional é inimiga da grandeza.

Hoje serei o mestre das minhas emoções e terei êxito.`,
  },
  {
    id: 7,
    title: "Rirei do mundo",
    preview:
      "Ninguém pode levar a sério alguém que ri. Por isso, rirei do mundo. E como posso rir quando enfrento o homem ou o destino...",
    image: "/images/perg7.png",
    fullText: `Rirei do mundo.

Ninguém pode levar a sério alguém que ri.

Por isso, rirei do mundo.

E como posso rir quando enfrento o homem ou o destino? De hoje em diante, recordarei este segredo: Rir é a melhor forma de aliviar a dor e curar o espírito.

Rirei do mundo.

E como posso rir quando nada há para rir? Aprenderei este segredo: Há sempre algo para rir.

Rirei do mundo.

E como posso controlar minhas emoções para que cada dia seja produtivo? Eu rirei.

Rirei do mundo.

Jamais permitirei que a tristeza ou a dor me dominem. Se o dia for mau, rirei. Se o dia for bom, rirei.

Rirei do mundo.

E como enfrentarei cada adversidade? Com risos.

Rirei do mundo.

E como enfrentarei a riqueza e o poder? Com risos.

Rirei do mundo.

E como enfrentarei aqueles que me insultam e me criticam? Com risos.

Rirei do mundo.

E como enfrentarei os fracassos? Com risos.

Rirei do mundo.

E como enfrentarei aqueles que me elogiam? Com risos.

Rirei do mundo.

E como enfrentarei o excesso de confiança? Com risos.

Rirei do mundo.

E como enfrentarei o medo? Com risos.

Rirei do mundo.

De hoje em diante, recordarei este segredo: Rir é a melhor forma de aliviar a dor e curar o espírito.

Rirei do mundo.

E deste momento em diante, aprenderei este segredo: Rir é a melhor forma de enfrentar o destino.

Rirei do mundo e terei êxito.`,
  },
  {
    id: 8,
    title: "Hoje multiplicarei meu valor em cem vezes",
    preview:
      "Sou como um grão de trigo que enfrenta um campo de cevada, mas o grão de trigo não se transforma em uma pilha de cevada...",
    image: "/images/perg8.png",
    fullText: `Hoje multiplicarei meu valor em cem vezes.

Sou como um grão de trigo que enfrenta um campo de cevada, mas o grão de trigo não se transforma em uma pilha de cevada. Deve crescer e ser plantado novamente até que seus múltiplos grãos encham o campo.

Assim também eu cresço, e hoje multiplicarei meu valor em cem vezes.

E como farei isso? Primeiro, estabelecerei objetivos para mim mesmo, os objetivos de hoje, da semana, do mês, do ano e da minha vida. Assim como a chuva deve cair antes que o trigo cresça, eu também devo ter objetivos antes que minha vida cresça.

Hoje multiplicarei meu valor em cem vezes.

E como enfrentarei cada dia? Com ações.

Hoje multiplicarei meu valor em cem vezes.

E como enfrentarei cada obstáculo? Com persistência.

Hoje multiplicarei meu valor em cem vezes.

E como enfrentarei cada fracasso? Com fé.

Hoje multiplicarei meu valor em cem vezes.

E como enfrentarei cada sucesso? Com humildade.

Hoje multiplicarei meu valor em cem vezes.

E como enfrentarei meus inimigos? Com amor.

Hoje multiplicarei meu valor em cem vezes.

E como enfrentarei meu trabalho? Com dedicação.

Hoje multiplicarei meu valor em cem vezes.

E como enfrentarei meu destino? Com confiança.

Hoje multiplicarei meu valor em cem vezes.

De hoje em diante, recordarei este segredo: O homem só pode crescer se multiplicar seu valor.

Hoje multiplicarei meu valor em cem vezes.`,
  },
  {
    id: 9,
    title: "Aja agora",
    preview:
      "Minha vida não é mais do que um piscar de olhos na eternidade. E, contudo, o tempo é suficiente para que eu prove meu valor.",
    image: "/images/perg9.png",
    fullText: `Aja agora.

Minha vida não é mais do que um piscar de olhos na eternidade. E, contudo, o tempo é suficiente para que eu prove meu valor.

O fracasso não me vencerá se minha determinação em alcançar o sucesso for suficientemente forte. De hoje em diante, aproveitarei cada momento do dia.

Aja agora.

Jamais perderei um dia lamentando o fracasso de ontem, nem me preocuparei com o amanhã.

Aja agora.

Jamais deixarei que as ações de hoje sejam prejudicadas pela incerteza do amanhã.

Aja agora.

De hoje em diante, aproveitarei cada momento do dia.

Aja agora.

E como enfrentarei cada dia? Com ação.

Aja agora.

E como enfrentarei cada obstáculo? Com ação.

Aja agora.

E como enfrentarei cada fracasso? Com ação.

Aja agora.

E como enfrentarei cada sucesso? Com ação.

Aja agora.

E como enfrentarei meus inimigos? Com ação.

Aja agora.

E como enfrentarei meu trabalho? Com ação.

Aja agora.

E como enfrentarei meu destino? Com ação.

Aja agora.

De hoje em diante, recordarei este segredo: O homem só pode alcançar o sucesso se agir agora.

Aja agora.

E deste momento em diante, aprenderei este segredo: O fracasso só vence aquele que não age.

Aja agora e terei êxito.`,
  },
]

// Funções utilitárias de data e hora
const formatDateToKey = (date: Date): string => {
  // Garante que a data seja formatada no fuso horário local
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}` // YYYY-MM-DD
}

const formatDateToDisplay = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  return date.toLocaleDateString("pt-BR", options)
}

// Modificar a função getPeriod para retornar strings em português
const getPeriod = (hour: number): "morning" | "afternoon" | "evening" => {
  if (hour >= 4 && hour < 12) return "morning" // 04h00 - 11h59
  if (hour >= 12 && hour < 19) return "afternoon" // 12h00 - 18h59
  return "evening" // 19h00 - 03h59 (do dia seguinte)
}

const getReadingDay = (timestamp: number): Date => {
  const date = new Date(timestamp)
  const hour = date.getHours()
  // Se for noite (19h00 - 03h59), e o horário for antes das 4h do dia atual,
  // significa que é a noite do dia anterior.
  if (hour >= 0 && hour < 4) {
    date.setDate(date.getDate() - 1)
  }
  date.setHours(0, 0, 0, 0) // Zera a hora para a chave do dia
  return date
}

// Funções para calcular dias completos e consecutivos (agora baseadas em ReadingEntry[] e não no objeto aninhado)
const isDayCompleted = (dailyReadings: ReadingEntry[]): boolean => {
  const periods = dailyReadings.map((r) => r.period)
  return periods.includes("morning") && periods.includes("afternoon") && periods.includes("evening")
}

const calculateCompletedDays = (allReadings: ReadingEntry[], scrollId: number): number => {
  const readingsForScroll = allReadings.filter((r) => r.scrollId === scrollId)
  const readingsByDate: { [date: string]: ReadingEntry[] } = {}
  readingsForScroll.forEach((r) => {
    if (!readingsByDate[r.dateKey]) {
      readingsByDate[r.dateKey] = []
    }
    readingsByDate[r.dateKey].push(r)
  })

  let count = 0
  for (const dateKey in readingsByDate) {
    if (isDayCompleted(readingsByDate[dateKey])) {
      count++
    }
  }
  return count
}

const calculateConsecutiveDays = (allReadings: ReadingEntry[], scrollId: number): number => {
  const readingsForScroll = allReadings.filter((r) => r.scrollId === scrollId)
  const readingsByDate: { [date: string]: ReadingEntry[] } = {}
  readingsForScroll.forEach((r) => {
    if (!readingsByDate[r.dateKey]) {
      readingsByDate[r.dateKey] = []
    }
    readingsByDate[r.dateKey].push(r)
  })

  const sortedDates = Object.keys(readingsByDate)
    .filter((dateKey) => isDayCompleted(readingsByDate[dateKey]))
    .sort() // Sorts YYYY-MM-DD strings correctly

  if (sortedDates.length === 0) return 0

  let consecutiveCount = 0
  let lastDate: Date | null = null

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const currentDate = new Date(sortedDates[i])
    currentDate.setHours(0, 0, 0, 0) // Normalize to start of day

    if (lastDate === null) {
      // Check if the last completed day is today or yesterday
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      if (currentDate.getTime() === today.getTime() || currentDate.getTime() === yesterday.getTime()) {
        consecutiveCount = 1
        lastDate = currentDate
      } else {
        break // No recent consecutive days
      }
    } else {
      const prevDay = new Date(lastDate)
      prevDay.setDate(lastDate.getDate() - 1)
      if (currentDate.getTime() === prevDay.getTime()) {
        consecutiveCount++
        lastDate = currentDate
      } else {
        break // Streak broken
      }
    }
  }
  return consecutiveCount
}

// Função para gerar mensagens motivacionais
const getMotivationalMessage = (completedDays: number, consecutiveDays: number, totalDays: number) => {
  if (completedDays === 0) {
    return {
      message: "Comece hoje sua jornada de transformação!",
      type: "start",
      color: "text-blue-600",
    }
  }

  if (completedDays >= totalDays) {
    return {
      message: "🎉 PARABÉNS! Você conquistou a Regra de Ouro dos 30 dias! Você é imparável!",
      type: "golden",
      color: "text-yellow-600",
    }
  }

  if (consecutiveDays >= 21) {
    return {
      message: "🔥 Incrível! 21 dias consecutivos! Você está criando um hábito poderoso!",
      type: "habit",
      color: "text-orange-600",
    }
  }

  if (consecutiveDays >= 14) {
    return {
      message: "💪 Duas semanas seguidas! Sua disciplina está se fortalecendo!",
      type: "strength",
      color: "text-purple-600",
    }
  }

  if (consecutiveDays >= 7) {
    return {
      message: "⭐ Uma semana completa! Você está no caminho certo!",
      type: "week",
      color: "text-green-600",
    }
  }

  if (consecutiveDays >= 3) {
    return {
      message: "🚀 Você está indo bem! Leu por " + consecutiveDays + " dias seguidos! Continue assim!",
      type: "progress",
      color: "text-green-600",
    }
  }

  if (completedDays >= 1) {
    return {
      message: "👏 Ótimo começo! Continue sua jornada de crescimento!",
      type: "beginning",
      color: "text-blue-600",
    }
  }

  return {
    message: "Comece hoje sua transformação!",
    type: "default",
    color: "text-gray-600",
  }
}

type Screen = "launch" | "home" | "details" | "reading"

export default function UCAApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("launch")
  const [selectedScrollId, setSelectedScrollId] = useState<number | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { toast } = useToast()

  // Usar useLiveQuery para obter dados do Dexie
  const userSettings = useLiveQuery(() => db.userSettings.get("settings"), [])
  const allScrollProgress = useLiveQuery(() => db.scrollProgress.toArray(), [])
  const allReadings = useLiveQuery(() => db.readings.toArray(), [])

  // Efeito para inicializar o banco de dados se estiver vazio
  useEffect(() => {
    const initializeDb = async () => {
      // Upsert da entry de configurações
      await db.userSettings.put({
        id: "settings",
        currentScrollId: 1,
        notificationSettings: {
          morning: "07h59",
          afternoon: "11h59",
          evening: "20h59",
        },
      })

      // Upsert do progresso de cada pergaminho
      await db.transaction("rw", db.scrollProgress, async () => {
        for (const scroll of staticScrolls) {
          await db.scrollProgress.put({
            scrollId: scroll.id,
            completedDays: 0,
            lastReadingDate: null,
          })
        }
      })
    }
    initializeDb()
  }, [])

  const confirmReading = useCallback(async () => {
    const now = new Date()
    const readingTimestamp = now.getTime()
    const readingDay = getReadingDay(readingTimestamp)
    const readingDayKey = formatDateToKey(readingDay)
    const currentHour = now.getHours()
    const period = getPeriod(currentHour)

    const currentScrollId = userSettings?.currentScrollId || 1

    try {
      // Criar um ID composto para a entrada de leitura
      const readingId = `${currentScrollId}-${readingDayKey}-${period}`

      // Adicionar ou atualizar a entrada de leitura
      await db.readings.put({
        id: readingId,
        scrollId: currentScrollId,
        dateKey: readingDayKey,
        period: period,
        timestamp: readingTimestamp,
      })

      // Recalcular completedDays e lastReadingDate para o scroll atual
      const updatedReadingsForScroll = await db.readings.where({ scrollId: currentScrollId }).toArray()
      const newCompletedDays = calculateCompletedDays(updatedReadingsForScroll, currentScrollId)
      const newLastReadingDate = readingDayKey

      await db.scrollProgress.update(currentScrollId, {
        completedDays: newCompletedDays,
        lastReadingDate: newLastReadingDate,
      })

      // Verificar se o pergaminho atual foi concluído (30 dias) e avançar para o próximo
      if (newCompletedDays >= 30 && currentScrollId < staticScrolls.length) {
        await db.userSettings.update("settings", { currentScrollId: currentScrollId + 1 })
        toast({
          title: `Pergaminho ${currentScrollId} Concluído!`,
          description: `Parabéns! Você completou 30 dias de leitura. Próximo: Pergaminho ${currentScrollId + 1}.`,
        })
      } else {
        toast({
          title: "Leitura Confirmada!",
          description: `Sua leitura da ${
            period === "morning" ? "manhã" : period === "afternoon" ? "tarde" : "noite"
          } foi registrada para o dia ${formatDateToDisplay(readingDay)}.`,
        })
      }
    } catch (error) {
      console.error("Erro ao confirmar leitura:", error)
      toast({
        title: "Erro ao Salvar Leitura",
        description: "Não foi possível registrar sua leitura. Tente novamente.",
        variant: "destructive",
      })
    }

    setAgreedToTerms(false) // Reset toggle after confirmation
    setCurrentScreen("home") // Go back to home after confirming
    window.scrollTo(0, 0) // Scroll to the top of the page
  }, [userSettings, toast])

  // handleNotificationSave agora aceita os novos settings como argumento
  const handleNotificationSave = useCallback(
    async (newSettings: UserSettings["notificationSettings"]) => {
      if (!userSettings) return
      try {
        await db.userSettings.update("settings", {
          notificationSettings: newSettings, // Usa os novos settings passados
        })
        toast({
          title: "Configurações Salvas!",
          description: "Suas preferências de notificação foram atualizadas.",
        })
      } catch (error) {
        console.error("Erro ao salvar notificações:", error)
        toast({
          title: "Erro ao Salvar",
          description: "Não foi possível salvar as configurações de notificação.",
          variant: "destructive",
        })
      }
    },
    [userSettings, toast],
  ) // userSettings ainda é uma dependência para acessar o ID 'settings'

  const handleResetApp = useCallback(async () => {
    if (confirm("Tem certeza que deseja recomeçar? Todos os seus registros de leitura serão apagados.")) {
      try {
        await db.readings.clear()
        await db.scrollProgress.clear()
        await db.userSettings.clear()

        // Re-initialize settings and scroll progress
        await db.userSettings.add({
          id: "settings",
          currentScrollId: 1,
          notificationSettings: {
            morning: "07h59",
            afternoon: "11h59",
            evening: "20h59",
          },
        })
        for (const scroll of staticScrolls) {
          await db.scrollProgress.add({
            scrollId: scroll.id,
            completedDays: 0,
            lastReadingDate: null,
          })
        }

        setCurrentScreen("home")
        toast({
          title: "Aplicativo Reiniciado!",
          description: "Todos os seus registros foram apagados. Comece sua jornada novamente!",
        })
      } catch (error) {
        console.error("Erro ao reiniciar aplicativo:", error)
        toast({
          title: "Erro ao Reiniciar",
          description: "Não foi possível reiniciar o aplicativo.",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  // Carregando estado enquanto os dados do Dexie são buscados
  if (userSettings === undefined || allScrollProgress === undefined || allReadings === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    )
  }

  const currentScrollId = userSettings?.currentScrollId || 1
  const currentUserScrollProgress = allScrollProgress?.find((s) => s.scrollId === currentScrollId) || {
    scrollId: currentScrollId,
    completedDays: 0,
    lastReadingDate: null,
  }

  const totalProgress = Math.round((currentUserScrollProgress.completedDays / 30) * 100)
  const remainingDays = 30 - currentUserScrollProgress.completedDays

  const allScrollsCompleted = allScrollProgress?.every((s) => s.completedDays >= 30) || false

  const LaunchScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-700 flex flex-col text-white">
      {/* Imagem da equipe na parte superior */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Image
            src="/images/team-photo.png"
            alt="Team UCA"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Conteúdo textual na parte inferior */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">UNIÃO</h1>
        <h1 className="text-3xl font-bold mb-2">COMPROMETIMENTO</h1>
        <h1 className="text-3xl font-bold mb-6">AÇÃO</h1>

        <p className="text-lg mb-8 px-4 leading-relaxed">
          O app que mantém as águias que fizeram o treinamento DL no caminho de evolução
        </p>

        <Button
          onClick={() => setCurrentScreen("home")}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-full w-full max-w-xs mx-auto font-semibold"
        >
          Eu conseguirei!
        </Button>
      </div>
    </div>
  )

  const HomeScreen = () => {
    const sortedScrolls = [...staticScrolls].sort((a, b) => a.id - b.id)

    const currentScrollProgressData = allScrollProgress?.find((s) => s.scrollId === currentScrollId) || {
      scrollId: currentScrollId,
      completedDays: 0,
      lastReadingDate: null,
    }

    const currentScrollCompletedDays = currentScrollProgressData.completedDays
    const currentScrollTotalDays = 30 // Fixed for all scrolls
    const currentScrollRemainingDays = currentScrollTotalDays - currentScrollCompletedDays
    const currentScrollProgress = Math.round((currentScrollCompletedDays / currentScrollTotalDays) * 100)

    const currentScrollReadings = allReadings?.filter((r) => r.scrollId === currentScrollId) || []
    const currentScrollConsecutiveDays = calculateConsecutiveDays(currentScrollReadings, currentScrollId)
    const motivationalData = getMotivationalMessage(
      currentScrollCompletedDays,
      currentScrollConsecutiveDays,
      currentScrollTotalDays,
    )

    const lastReadingDisplay = currentScrollProgressData?.lastReadingDate
      ? formatDateToDisplay(
          new Date(
            Number.parseInt(currentScrollProgressData.lastReadingDate.substring(0, 4)), // Ano
            Number.parseInt(currentScrollProgressData.lastReadingDate.substring(5, 7)) - 1, // Mês (0-indexado)
            Number.parseInt(currentScrollProgressData.lastReadingDate.substring(8, 10)), // Dia
          ),
        )
      : "não iniciada"

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold mb-4">Você está no Pergaminho {currentScrollId}</h1>

          <Card
            className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentScreen("details")}
          >
            <CardContent className="p-4">
              <p className="text-gray-600 mb-4 text-center">Faltam {currentScrollRemainingDays} dias de leitura</p>
              <div className="flex items-center justify-center gap-6">
                {/* Percentual à esquerda */}
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-blue-500">{currentScrollProgress}%</span>
                  <span className="text-sm text-gray-500">concluído</span>
                </div>

                {/* Gráfico circular à direita */}
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${currentScrollProgress}, 100`}
                      strokeLinecap="round"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
              <div className={`text-sm ${motivationalData.color} font-medium text-center p-2 mt-4 rounded-lg`}>
                {motivationalData.message}
              </div>
              <p className="text-sm text-gray-500 text-center mt-2">clique para mais detalhes</p>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 space-y-4">
          {sortedScrolls.map((scroll) => {
            const scrollUserData = allScrollProgress?.find((s) => s.scrollId === scroll.id) || {
              scrollId: scroll.id,
              completedDays: 0,
              lastReadingDate: null,
            }
            const lastReadingDisplay = scrollUserData?.lastReadingDate
              ? formatDateToDisplay(
                  new Date(
                    Number.parseInt(scrollUserData.lastReadingDate.substring(0, 4)),
                    Number.parseInt(scrollUserData.lastReadingDate.substring(5, 7)) - 1,
                    Number.parseInt(scrollUserData.lastReadingDate.substring(8, 10)),
                  ),
                )
              : "não iniciada"
            const scrollCompletedDays = scrollUserData?.completedDays || 0
            const scrollProgressValue = (scrollCompletedDays / 30) * 100
            const isCompleted = scrollCompletedDays >= 30

            return (
              <Card key={scroll.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Image
                      src={scroll.image || "/placeholder.svg"}
                      alt={scroll.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Pergaminho {scroll.id}</p>
                      <h3 className="font-bold text-lg mb-2">{scroll.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-3">{scroll.preview}</p>
                      <p className="text-sm text-gray-500">
                        Última leitura: <span className="italic">{lastReadingDisplay}</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={scrollProgressValue} className="flex-1 h-2" />
                        <span className="text-xs text-gray-600">{scrollCompletedDays}/30 dias</span>
                        {isCompleted && <Award className="w-4 h-4 text-yellow-500" aria-label="Pergaminho Concluído" />}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedScrollId(scroll.id)
                        setCurrentScreen("reading")
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Ler Pergaminho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {allScrollsCompleted && (
          <div className="p-4 text-center">
            <Button onClick={handleResetApp} className="bg-purple-600 hover:bg-purple-700 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Recomeçar Leitura
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Componente DetailsScreen agora recebe props para gerenciar as notificações
  const DetailsScreen = ({
    initialNotificationSettings,
    onSaveNotifications,
  }: {
    initialNotificationSettings: UserSettings["notificationSettings"]
    onSaveNotifications: (newSettings: UserSettings["notificationSettings"]) => void
  }) => {
    const [currentNotificationSettings, setCurrentNotificationSettings] = useState(initialNotificationSettings)

    // Sincroniza o estado local com as props quando elas mudam (ex: após um reset)
    useEffect(() => {
      setCurrentNotificationSettings(initialNotificationSettings)
    }, [initialNotificationSettings])

    const currentScrollDetails = staticScrolls.find((s) => s.id === currentScrollId)
    const currentUserScrollProgressData = allScrollProgress?.find((s) => s.scrollId === currentScrollId) || {
      scrollId: currentScrollId,
      completedDays: 0,
      lastReadingDate: null,
    }

    // Fetch all readings for the current scroll
    const readingsForCurrentScroll = allReadings?.filter((r) => r.scrollId === currentScrollId) || []

    // Group readings by dateKey
    const readingsByDate: { [date: string]: ReadingEntry[] } = {}
    readingsForCurrentScroll.forEach((r) => {
      if (!readingsByDate[r.dateKey]) {
        readingsByDate[r.dateKey] = []
      }
      readingsByDate[r.dateKey].push(r)
    })

    // Prepare calendar data for the current scroll
    const calendarEntries = Object.keys(readingsByDate)
      .map((dateKey) => {
        const dailyReadings = readingsByDate[dateKey]
        const [entryYear, entryMonth, entryDay] = dateKey.split("-").map(Number)
        const date = new Date(entryYear, entryMonth - 1, entryDay) // Local date for this entry
        const now = new Date()
        const entryDate = new Date(entryYear, entryMonth - 1, entryDay) // Re-create for consistent time handling

        const allPeriods: ("morning" | "afternoon" | "evening")[] = ["morning", "afternoon", "evening"]
        const periodStatuses: {
          periodName: string
          status: "completed" | "missed" | "attention"
          time?: string
        }[] = []

        // Sort daily readings by timestamp to ensure consistent order (morning, afternoon, evening)
        dailyReadings.sort((a, b) => a.timestamp - b.timestamp)

        allPeriods.forEach((period) => {
          const reading = dailyReadings.find((r) => r.period === period)
          const periodDisplayName = period === "morning" ? "manhã" : period === "afternoon" ? "tarde" : "noite"

          if (reading) {
            periodStatuses.push({
              periodName: periodDisplayName,
              status: "completed",
              time: new Date(reading.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            })
          } else {
            // No reading for this period
            let periodStartTime: Date
            let periodEndTime: Date

            if (period === "morning") {
              periodStartTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 4, 0, 0)
              periodEndTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 12, 0, 0)
            } else if (period === "afternoon") {
              periodStartTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 12, 0, 0)
              periodEndTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 19, 0, 0)
            } else {
              // evening
              periodStartTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 19, 0, 0)
              periodEndTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate() + 1, 4, 0, 0)
            }

            const nowTime = now.getTime()
            const periodStartTimeMs = periodStartTime.getTime()
            const periodEndTimeMs = periodEndTime.getTime()

            // Check if 'now' falls within the active window for this period of this specific 'entryDate'
            if (nowTime >= periodStartTimeMs && nowTime < periodEndTimeMs) {
              periodStatuses.push({
                periodName: periodDisplayName,
                status: "attention",
              })
            } else if (nowTime >= periodEndTimeMs) {
              // The period has already passed
              periodStatuses.push({
                periodName: periodDisplayName,
                status: "missed",
              })
            } else {
              // The period is in the future (relative to 'now') or it's a past date and the period is in the future
              // For a past date, if not completed, it's missed. For today, if not yet started, it's attention.
              // This logic needs to be careful. If entryDate is in the past, and period is not completed, it's missed.
              // If entryDate is today, and period is in the future, it's attention.
              const todayKey = formatDateToKey(now)
              if (dateKey === todayKey) {
                periodStatuses.push({
                  periodName: periodDisplayName,
                  status: "attention",
                })
              } else {
                periodStatuses.push({
                  periodName: periodDisplayName,
                  status: "missed",
                })
              }
            }
          }
        })

        return {
          date: formatDateToDisplay(date),
          dateKey: dateKey, // Adiciona dateKey para ordenação
          status: isDayCompleted(dailyReadings) ? "completed" : "partial",
          periodStatuses: periodStatuses, // Nova array com status para cada período
          bonus: isDayCompleted(dailyReadings), // Assumindo que bônus significa 3x completo
        }
      })
      .filter((day) => day.periodStatuses.some((ps) => ps.status === "completed" || ps.status === "attention")) // Filtra para mostrar apenas dias com pelo menos 1 marcação ou atenção
      .sort(
        (a, b) => new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime(), // Ordena por dateKey (descrescente)
      )

    const currentScrollCompletedDays = currentUserScrollProgressData.completedDays
    const currentScrollConsecutiveDays = calculateConsecutiveDays(readingsForCurrentScroll, currentScrollId)
    const motivationalData = getMotivationalMessage(currentScrollCompletedDays, currentScrollConsecutiveDays, 30)

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen("home")}
            className="mr-4"
            aria-label="Voltar para a tela inicial"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Detalhes</h1>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Calendário
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Notificações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="p-4 space-y-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={currentScrollDetails?.image || "/placeholder.svg"}
                    alt={`Pergaminho ${currentScrollDetails?.id}`}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                  <h3 className="font-bold">Pergaminho {currentScrollDetails?.id}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total: {currentScrollCompletedDays} dias</p>
                </div>
              </div>

              <div className={`text-sm ${motivationalData.color} font-medium text-center p-2 bg-gray-50 rounded-lg`}>
                {motivationalData.message}
              </div>
            </div>

            {calendarEntries.length > 0 ? (
              calendarEntries.map((day, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{day.date}</span>
                      </div>
                      {day.bonus && <Badge className="bg-green-500 text-white">+ 1 dia</Badge>}
                      {day.status === "partial" && (
                        <Badge variant="outline" className="text-orange-500 border-orange-500">
                          0 dias
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {day.periodStatuses.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          {item.status === "completed" ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : item.status === "missed" ? (
                            <X className="w-4 h-4 text-red-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" /> // Ícone para "atenção"
                          )}
                          <span
                            className={`text-sm ${item.status === "missed" ? "text-red-500" : item.status === "attention" ? "text-yellow-600" : "text-green-600"}`}
                          >
                            {item.time || item.periodName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8">Nenhuma leitura registrada para este pergaminho ainda.</p>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="p-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-5 h-5" />
                  <div>
                    <h3 className="font-bold">Notificações</h3>
                    <p className="text-sm text-gray-600">
                      Defina os horários que o APP irá te lembrar de fazer a leitura do pergaminho
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Sun className="w-5 h-5 text-orange-500" />
                    <span className="font-medium w-16">Manhã</span>
                    <div className="flex gap-2">
                      {["07h59", "08h59", "09h59"].map((time) => (
                        <Button
                          key={time}
                          variant={currentNotificationSettings.morning === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setCurrentNotificationSettings((prev) => ({ ...prev, morning: time }))
                          }}
                          className={currentNotificationSettings.morning === time ? "bg-blue-500" : ""}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium w-16">Tarde</span>
                    <div className="flex gap-2">
                      {["11h59", "12h59", "13h59"].map((time) => (
                        <Button
                          key={time}
                          variant={currentNotificationSettings.afternoon === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setCurrentNotificationSettings((prev) => ({ ...prev, afternoon: time }))
                          }}
                          className={currentNotificationSettings.afternoon === time ? "bg-blue-500" : ""}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Moon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium w-16">Noite</span>
                    <div className="flex gap-2">
                      {["20h59", "21h59", "22h59"].map((time) => (
                        <Button
                          key={time}
                          variant={currentNotificationSettings.evening === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setCurrentNotificationSettings((prev) => ({ ...prev, evening: time }))
                          }}
                          className={currentNotificationSettings.evening === time ? "bg-blue-500" : ""}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onSaveNotifications(currentNotificationSettings)}
                  className="w-full mt-8 bg-green-500 hover:bg-green-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  const ReadingScreen = () => {
    const displayScrollId = selectedScrollId || currentScrollId
    const currentScrollData = staticScrolls.find((s) => s.id === displayScrollId) || staticScrolls[0]
    const currentUserScrollProgressForDisplay = allScrollProgress?.find((s) => s.scrollId === displayScrollId) || {
      scrollId: displayScrollId,
      completedDays: 0,
      lastReadingDate: null,
    }

    const isCurrentActiveScroll = displayScrollId === currentScrollId
    const hasCompleted30Days = currentUserScrollProgressForDisplay.completedDays >= 30

    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen("home")}
            className="mr-4"
            aria-label="Voltar para a tela inicial"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-bold">Pergaminho {currentScrollData.id}</h1>
          <div className="ml-auto">
            <Progress value={(currentUserScrollProgressForDisplay.completedDays / 30) * 100} className="w-20" />
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{currentScrollData.title}</h2>

          <div className="prose prose-lg max-w-none space-y-4 text-gray-800 leading-relaxed">
            {currentScrollData.fullText.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            {isCurrentActiveScroll && !hasCompleted30Days && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                  aria-describedby="terms-description"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Declaro que li o texto por completo pois, quem faz as coisas pela metade, é um fracassado!
                </label>
                <span id="terms-description" className="sr-only">
                  Marque esta caixa para confirmar que você leu o texto por completo.
                </span>
              </div>
            )}

            <Button
              onClick={confirmReading}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
              disabled={!isCurrentActiveScroll || !agreedToTerms || hasCompleted30Days}
            >
              <Check className="w-5 h-5 mr-2" />
              Confirmar leitura
            </Button>
            {!isCurrentActiveScroll && (
              <p className="text-sm text-red-500" aria-live="polite">
                Você só pode marcar como lido o Pergaminho {currentScrollId}.
              </p>
            )}
            {hasCompleted30Days && (
              <p className="text-sm text-green-600" aria-live="polite">
                Você já completou 30 dias de leitura para este pergaminho!
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "launch":
        return <LaunchScreen />
      case "home":
        return <HomeScreen />
      case "details":
        return (
          <DetailsScreen
            initialNotificationSettings={
              userSettings?.notificationSettings || { morning: "07h59", afternoon: "11h59", evening: "20h59" }
            }
            onSaveNotifications={handleNotificationSave}
          />
        )
      case "reading":
        return <ReadingScreen />
      default:
        return <LaunchScreen />
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen transition-all duration-300 ease-in-out">
      {renderScreen()}
      <Toaster /> {/* Componente para exibir os toasts */}
    </div>
  )
}
