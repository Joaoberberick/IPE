"""
seed.py — Popula o banco de dados do TutorHistória com nós de domínio e questões
sobre a Primeira Guerra Mundial.

Uso:
    python seed.py
"""

import os
import sys
import json

# Garante que o diretório do projeto está no path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import app, db
from models import NoDominio, Questao


# ---------------------------------------------------------------------------
# Conteúdo HTML dos nós
# ---------------------------------------------------------------------------

CONTEUDO_NO_1 = """
<article class="conteudo-no">
  <h2>Contexto Pré-Guerra (Antes de 1914)</h2>

  <section id="sec-contexto-europa">
    <h3>A Europa no início do século XX</h3>
    <p>
      Ao amanhecer do século XX, a Europa era o centro econômico, político e militar do mundo. Suas grandes
      potências — Reino Unido, França, Alemanha, Áustria-Hungria, Rússia e Itália — controlavam vastos impérios
      coloniais que se espalhavam por todos os continentes. Por décadas, a chamada <strong>Paz Armada</strong>
      havia mantido a violência em escala continental contida, mas as tensões acumulavam-se sob a superfície
      como pressão em uma caldeira prestes a explodir.
    </p>
    <p>
      Quatro grandes forças moldavam esse mundo e, em última análise, conduziram a humanidade à catástrofe
      de 1914: o <strong>imperialismo</strong>, o <strong>nacionalismo</strong>, a <strong>militarização</strong>
      e o <strong>sistema de alianças</strong>.
    </p>
  </section>

  <section id="sec-contexto-imperialismo">
    <h3>Imperialismo: a corrida colonial</h3>
    <p>
      O imperialismo europeu atingiu seu auge entre 1870 e 1914. Nações competiam ferozmente por colônias
      na África e na Ásia, vendo-as como fontes de matérias-primas, mercados consumidores e prestígio
      nacional. A Alemanha, unificada apenas em 1871, sentia-se em desvantagem frente a potências coloniais
      estabelecidas como o Reino Unido e a França.
    </p>
    <p>
      As <strong>Crises Marroquinas</strong> de 1905 e 1911 — quando a Alemanha desafiou a influência francesa
      no Marrocos — quase desencadearam conflitos abertos e deixaram a Europa em estado de alerta permanente.
      A rivalidade naval entre Alemanha e Reino Unido, manifestada na corrida armamentista para construção
      de couraçados (<em>Dreadnoughts</em>), aprofundou a desconfiança mútua.
    </p>
  </section>

  <section id="sec-contexto-nacionalismo">
    <h3>Nacionalismo: o perigo nos Bálcãs</h3>
    <p>
      O <strong>nacionalismo</strong> — a crença de que cada nação étnica e cultural deveria ter seu próprio
      Estado soberano — era uma força explosiva, especialmente nos Bálcãs. A região era dominada pelo
      decadente <strong>Império Austro-Húngaro</strong> e pelo igualmente frágil <strong>Império Otomano</strong>,
      que governavam populações de diferentes etnias: sérvios, croatas, eslovenos, búlgaros, romenos e gregos,
      entre outros.
    </p>
    <p>
      A Sérvia, que havia dobrado de tamanho após as <strong>Guerras Balcânicas</strong> de 1912-1913,
      sonhava em unir todos os eslavos do sul em um grande Estado eslavo. Isso ameaçava diretamente a
      integridade territorial da Áustria-Hungria, que via o nacionalismo sérvio como um vírus que poderia
      desintegrar seu multifacetado império. O pan-eslavismo russo, por sua vez, apoiava as aspirações sérvias,
      criando uma rede de solidariedades étnicas que atravessava fronteiras políticas.
    </p>
  </section>

  <section id="sec-contexto-aliancas">
    <h3>O Sistema de Alianças</h3>
    <p>
      Em busca de segurança, as potências europeias formaram dois grandes blocos militares que transformariam
      qualquer conflito localizado em uma conflagração continental:
    </p>
    <ul>
      <li>
        <strong>Tríplice Aliança (1882):</strong> Alemanha, Áustria-Hungria e Itália. O tratado previa
        assistência mútua em caso de ataque. Nota: a Itália mais tarde não honrou o tratado e acabou
        juntando-se aos Aliados em 1915.
      </li>
      <li>
        <strong>Tríplice Entente (1907):</strong> França, Rússia e Reino Unido. Surgiu de uma série de
        acordos bilaterais — a <em>Entente Cordiale</em> franco-britânica de 1904 e a <em>Entente
        Anglo-Russa</em> de 1907. Não era uma aliança militar rígida como a Tríplice Aliança, mas implicava
        cooperação estreita.
      </li>
    </ul>
    <p>
      Este sistema de alianças criou um mecanismo de escalonamento automático: uma crise entre dois países
      poderia arrastar todas as potências para o conflito em questão de dias, como viria a acontecer em
      julho e agosto de 1914.
    </p>
  </section>

  <section id="sec-contexto-militarismo">
    <h3>Corrida Armamentista e Militarismo</h3>
    <p>
      Todas as potências investiam maciçamente em seus exércitos e marinhas. A Alemanha duplicou o tamanho
      de seu exército entre 1870 e 1914. O Reino Unido respondia construindo mais navios de guerra. A França
      reorganizou seu exército após a humilhante derrota para a Prússia em 1870-71. A Rússia modernizava
      suas ferrovias para mobilizar tropas mais rapidamente.
    </p>
    <p>
      O militarismo não era apenas gasto em armamentos — era uma cultura. Oficiais militares gozavam de
      enorme prestígio social; planos de guerra detalhados, como o famoso <strong>Plano Schlieffen</strong>
      alemão (que previa uma guerra em duas frentes, derrotando primeiro a França, depois a Rússia),
      ditavam política externa. Os generais, em muitos casos, tinham mais influência que os diplomatas.
    </p>
  </section>

  <section>
    <h3>Conclusão</h3>
    <p>
      Em 1914, a Europa era uma câmara de pólvora. O sistema de alianças garantia que qualquer faísca
      poderia causar uma explosão continental. O imperialismo criara rivalidades profundas. O nacionalismo
      desestabilizava impérios multiétnicos. O militarismo tornava a guerra não apenas possível, mas,
      para muitos líderes, até desejável. Faltava apenas o gatilho — e ele viria dos Bálcãs.
    </p>
  </section>

  <section class="fontes">
    <h4>Fontes e Leituras Recomendadas</h4>
    <ul>
      <li>CLARK, Christopher. <em>Os Sonâmbulos: Como a Europa foi à Guerra em 1914</em>. São Paulo: Editora Schwarcz, 2014.</li>
      <li>MacMILLAN, Margaret. <em>A Guerra que Acabou com a Paz: O Caminho para 1914</em>. Rio de Janeiro: Intrínseca, 2014.</li>
      <li>HOBSBAWM, Eric. <em>A Era dos Impérios: 1875–1914</em>. São Paulo: Paz e Terra, 2011.</li>
      <li>KEEGAN, John. <em>A Primeira Guerra Mundial</em>. São Paulo: Companhia das Letras, 2014. cap. 1.</li>
      <li>JOLL, James; MARTEL, Gordon. <em>The Origins of the First World War</em>. 3. ed. Harlow: Pearson, 2007.</li>
    </ul>
  </section>
</article>
"""

CONTEUDO_NO_2 = """
<article class="conteudo-no">
  <h2>O Início da Guerra (1914)</h2>

  <section id="sec-inicio-atentado">
    <h3>O Assassinato em Sarajevo — 28 de junho de 1914</h3>
    <p>
      No domingo ensolarado de 28 de junho de 1914, o <strong>Arquiduque Franz Ferdinand</strong>, herdeiro
      do trono do Império Austro-Húngaro, e sua esposa Sophie chegaram à cidade de <strong>Sarajevo</strong>,
      capital da Bósnia, para inspecionar as manobras militares austro-húngaras na região. A escolha da data
      era politicamente insensata: 28 de junho era o Dia de São Vito, aniversário da histórica Batalha do
      Kosovo (1389), um símbolo sagrado do nacionalismo sérvio.
    </p>
    <p>
      Um grupo de jovens nacionalistas bósnios ligados à organização secreta sérvica <strong>Mão Negra</strong>
      (<em>Ujedinjenje ili smrt</em> — "Unificação ou Morte") aguardava ao longo do trajeto do arquiduque.
      A primeira tentativa de atentado falhou — uma bomba atirada contra o carro do arquiduque explodiu
      sob o veículo seguinte, ferindo vários aides.
    </p>
    <p>
      Mais tarde, em uma viagem improvisada para visitar os feridos no hospital, o carro do arquiduque
      parou por engano próximo a um café onde <strong>Gavrilo Princip</strong>, de 19 anos, havia entrado
      para comer um sanduíche após acreditar que a missão havia fracassado. Ao ver o arquiduque a menos
      de dois metros de distância, Princip sacou um revólver FN Model 1910 e disparou dois tiros. O
      Arquiduque Franz Ferdinand e a Duquesa Sophie morreram minutos depois. O mundo nunca mais seria o mesmo.
    </p>
  </section>

  <section id="sec-inicio-crise-julho">
    <h3>A Crise de Julho</h3>
    <p>
      O assassinato desencadeou a chamada <strong>Crise de Julho</strong>, um mês de intensas negociações
      diplomáticas, ultimatos e mobilizações militares que, no final, nenhuma das potências conseguiu — ou
      quis — deter.
    </p>
    <p>
      A Áustria-Hungria, determinada a usar o assassinato como pretexto para esmagar o poder sérvio,
      consultou a Alemanha. O Kaiser Wilhelm II e o chanceler Bethmann Hollweg emitiram o chamado
      <strong>"cheque em branco"</strong> — garantia de apoio incondicional à Áustria, quaisquer que
      fossem suas ações. Encorajada, a Áustria-Hungria enviou à Sérvia, em 23 de julho, um
      <strong>ultimato de 48 horas</strong> com dez exigências deliberadamente humilhantes, incluindo a
      permissão para investigadores austro-húngaros operarem em território sérvio — uma violação direta
      da soberania nacional.
    </p>
    <p>
      A Sérvia aceitou nove das dez demandas, recusando apenas a presença de funcionários austro-húngaros
      em seu território. A Áustria-Hungria considerou a resposta inadequada e declarou guerra à Sérvia em
      28 de julho de 1914 — exatamente um mês após o assassinato.
    </p>
  </section>

  <section id="sec-inicio-declaracoes">
    <h3>A Cadeia de Declarações de Guerra</h3>
    <p>
      O sistema de alianças então entrou em ação como um mecanismo de relógio mortal:
    </p>
    <ul>
      <li><strong>28 de julho:</strong> Áustria-Hungria declara guerra à Sérvia. Canhões austro-húngaros
      bombardeiam Belgrado.</li>
      <li><strong>30 de julho:</strong> Rússia inicia mobilização geral para defender a Sérvia (seus aliados
      eslavos).</li>
      <li><strong>1 de agosto:</strong> Alemanha declara guerra à Rússia, acionada pelo tratado com a
      Áustria-Hungria.</li>
      <li><strong>3 de agosto:</strong> Alemanha declara guerra à França, aliada da Rússia.</li>
      <li><strong>4 de agosto:</strong> A Alemanha invade a Bélgica neutra para executar o Plano Schlieffen
      (rota rápida para a França). O Reino Unido, que garantia a neutralidade belga pelo Tratado de Londres
      de 1839, declara guerra à Alemanha.</li>
      <li><strong>6 de agosto:</strong> Áustria-Hungria declara guerra à Rússia.</li>
      <li><strong>Agosto:</strong> Japão (aliado do Reino Unido) declara guerra à Alemanha. O Império Otomano
      entra ao lado das Potências Centrais em outubro.</li>
    </ul>
    <p>
      Em menos de seis semanas após o tiro de Princip em Sarajevo, os maiores impérios do mundo estavam
      em guerra. O que muitos esperavam que fosse um conflito rápido — "acabará antes do Natal", diziam —
      duraria mais de quatro anos e custaria a vida de cerca de 20 milhões de pessoas.
    </p>
  </section>

  <section id="sec-inicio-mobilizacao">
    <h3>Mobilização e a Ilusão da Guerra Rápida</h3>
    <p>
      Os líderes militares de todas as nações acreditavam que a guerra seria curta e decidida em campo
      aberto. O Plano Schlieffen alemão previa derrotar a França em seis semanas antes de virar todas
      as forças contra a Rússia. Os franceses, por sua vez, confiavam no <em>Plan XVII</em> — um ataque
      frontal agressivo para recuperar a Alsácia-Lorena.
    </p>
    <p>
      Nenhum desses planos funcionou como previsto. A resistência belga e britânica retardou o avanço
      alemão. A Batalha do Marne (setembro de 1914) deteve os alemães a menos de 50 km de Paris. Ambos
      os lados começaram a construir trincheiras para proteger suas posições — e o que deveria ser uma
      guerra de movimento transformou-se em um impasse mortal que duraria quatro anos.
    </p>
  </section>

  <section class="fontes">
    <h4>Fontes e Leituras Recomendadas</h4>
    <ul>
      <li>CLARK, Christopher. <em>Os Sonâmbulos: Como a Europa foi à Guerra em 1914</em>. São Paulo: Editora Schwarcz, 2014. cap. 11–12.</li>
      <li>MacMILLAN, Margaret. <em>A Guerra que Acabou com a Paz</em>. Rio de Janeiro: Intrínseca, 2014. cap. 23–25.</li>
      <li>KEEGAN, John. <em>A Primeira Guerra Mundial</em>. São Paulo: Companhia das Letras, 2014. cap. 2.</li>
      <li>ALBERTINI, Luigi. <em>The Origins of the War of 1914</em>. v. 2. Oxford: Oxford University Press, 1953.</li>
      <li>DEDIJER, Vladimir. <em>The Road to Sarajevo</em>. Nova York: Simon and Schuster, 1966.</li>
    </ul>
  </section>
</article>
"""

CONTEUDO_NO_3 = """
<article class="conteudo-no">
  <h2>Frentes e Batalhas (1914-1918)</h2>

  <section id="sec-frentes-trincheiras">
    <h3>A Guerra de Trincheiras</h3>
    <p>
      A Primeira Guerra Mundial ficou para sempre associada à imagem das <strong>trincheiras</strong> —
      longas valas escavadas na terra que se estendiam por centenas de quilômetros, formando uma linha
      de frente quase imóvel por anos. O que havia começado como uma medida temporária para proteger
      soldados do fogo inimigo tornou-se o ambiente permanente de combate de milhões de homens.
    </p>
    <p>
      Um sistema completo de trincheiras incluía a <strong>linha de frente</strong> (onde os soldados
      enfrentavam o inimigo), <strong>trincheiras de apoio</strong> e <strong>trincheiras de reserva</strong>,
      todas conectadas por valas de comunicação perpendiculares. Entre as trincheiras inimigas ficava a
      temida <strong><em>No Man's Land</em></strong> — uma faixa de terra devastada, cheia de arame farpado,
      crateras de bombas, lama e cadáveres irrecolhíveis.
    </p>
    <p>
      As condições nas trincheiras eram inimagináveis. Os soldados viviam em lama constante, infestada de
      ratos que se alimentavam dos mortos. Os piolhos eram companheiros permanentes. O <strong>pé das
      trincheiras</strong> — uma doença causada pelo frio e pela umidade constante — lisiava pés. Os
      bombas caíam dia e noite. O trauma psicológico, chamado de <strong><em>shell shock</em></strong>
      (hoje conhecido como PTSD), afetava um número enorme de combatentes.
    </p>
  </section>

  <section id="sec-frentes-ocidental">
    <h3>A Frente Ocidental</h3>
    <p>
      A <strong>Frente Ocidental</strong> se estendia por aproximadamente 700 quilômetros, da costa
      da Bélgica até a fronteira suíça. Era o teatro de guerra mais decisivo e o mais mortífero. Após
      a estabilização das frentes no final de 1914, os exércitos permaneceram em impasse por quatro anos,
      com ganhos territoriais frequentemente medidos em metros, ao custo de centenas de milhares de vidas.
    </p>

    <h4>Batalha de Verdun (fevereiro-dezembro de 1916)</h4>
    <p>
      Verdun é, até hoje, sinônimo de carnificina industrial. O General alemão Falkenhayn planejou uma
      ofensiva não para capturar território, mas para "sangrar o exército francês até a morte" —
      estratégia conhecida como <strong>guerra de desgaste</strong>. Os franceses, para quem Verdun
      era um símbolo nacional, nunca recuariam.
    </p>
    <p>
      O resultado foi dez meses de batalha contínua, com aproximadamente <strong>700.000 baixas combinadas</strong>
      (mortos, feridos, desaparecidos). A vila de Fleury-devant-Douaumont foi tomada e retomada 16 vezes.
      O solo de Verdun ainda está tão contaminado com metais pesados e explosivos não detonados que partes
      da região continuam interditadas ao público no século XXI.
    </p>

    <h4>Batalha do Somme (julho-novembro de 1916)</h4>
    <p>
      Lançada pelos britânicos e franceses para aliviar a pressão em Verdun, a Batalha do Somme é
      especialmente infame pelo primeiro dia de combate: <strong>1 de julho de 1916</strong>, quando o
      exército britânico sofreu aproximadamente <strong>57.470 baixas</strong> (incluindo 19.240 mortos)
      — o dia mais sangrento da história militar britânica.
    </p>
    <p>
      Após um bombardeio de artilharia de sete dias que deveria destruir as defesas alemãs, os soldados
      britânicos avançaram em linhas ordenadas contra as trincheiras alemãs. As metralhadoras alemãs,
      cujos operadores haviam sobrevivido nos bunkers subterrâneos, ceifaram as ondas de ataque. Ao
      final de quatro meses de batalha, os aliados haviam avançado apenas alguns quilômetros, ao custo
      de mais de <strong>1,2 milhão de baixas</strong> combinadas.
    </p>
    <p>
      O Somme também marcou a estreia dos <strong>tanques</strong> em combate — introduzidos pelos
      britânicos em setembro de 1916, ainda em pequeno número e com frequentes falhas mecânicas.
    </p>
  </section>

  <section id="sec-frentes-oriental">
    <h3>A Frente Oriental</h3>
    <p>
      A <strong>Frente Oriental</strong> era radicalmente diferente da Ocidental. Estendia-se por
      milhares de quilômetros — da costa do Báltico até o Mar Negro —, e a vastidão do teatro permitia
      mais movimento e flutuação das linhas de frente. Mas não era menos sangrenta.
    </p>
    <p>
      A Rússia mobilizou exércitos gigantescos, mas sofria de graves deficiências: falta de equipamentos,
      munição, comunicações e liderança competente. A <strong>Batalha de Tannenberg</strong> (agosto de
      1914) foi um desastre catastrófico — os alemães cercaram e destruíram dois exércitos russos,
      capturando mais de 90.000 prisioneiros. O general russo Samsonov se suicidou no campo de batalha.
    </p>
    <p>
      A <strong>Ofensiva Brusilov</strong> (1916), porém, foi um dos maiores sucessos militares da guerra.
      O General Aleksei Brusilov revolucionou a tática de ataque ao golpear em múltiplos pontos
      simultaneamente, evitando a previsibilidade das ofensivas aliadas no Ocidente. A ofensiva causou
      mais de um milhão de baixas austro-húngaras e alemãs, mas também esgotou as reservas russas,
      acelerando o colapso que levaria à Revolução de 1917.
    </p>
  </section>

  <section id="sec-frentes-outras">
    <h3>Outras Frentes</h3>
    <p>
      A guerra era verdadeiramente mundial. Na <strong>Frente Italiana</strong>, italianos e austro-húngaros
      travaram uma série de batalhas no Rio Isonzo, com o Italiano sofrendo a humilhante derrota de
      Caporetto (1917). No <strong>Oriente Médio</strong>, britânicos e aliados árabes combatiam o
      Império Otomano, com a famosa campanha de T.E. Lawrence ("Lawrence da Arábia") e a captura de
      Bagdá e Jerusalém. No <strong>Mar</strong>, a Batalha da Jutlândia (1916) foi o maior confronto
      naval da guerra, concluído sem vencedor claro, mas confirmando a supremacia naval britânica.
    </p>
  </section>

  <section class="fontes">
    <h4>Fontes e Leituras Recomendadas</h4>
    <ul>
      <li>KEEGAN, John. <em>A Primeira Guerra Mundial</em>. São Paulo: Companhia das Letras, 2014. cap. 5–8.</li>
      <li>HART, Peter. <em>The Great War: A Combat History of the First World War</em>. Oxford: Oxford University Press, 2013.</li>
      <li>MIDDLEBROOK, Martin. <em>The First Day on the Somme</em>. Londres: Allen Lane, 1971.</li>
      <li>HORNE, Alistair. <em>The Price of Glory: Verdun 1916</em>. Londres: Penguin, 1993.</li>
      <li>STRACHAN, Hew. <em>The First World War</em>. Nova York: Viking, 2004. cap. 6–7.</li>
    </ul>
  </section>
</article>
"""

CONTEUDO_NO_4 = """
<article class="conteudo-no">
  <h2>Tecnologia e Sociedade (1914-1918)</h2>

  <section id="sec-tech-revolucao">
    <h3>A Revolução Tecnológica da Guerra</h3>
    <p>
      A Primeira Guerra Mundial foi o primeiro grande conflito da era industrial, e isso ficou evidente
      na escala e na brutalidade das tecnologias empregadas. Armas desenvolvidas para massacrar em escala
      industrial transformaram para sempre a natureza da guerra — e deixaram cicatrizes na psique coletiva
      da humanidade.
    </p>
  </section>

  <section id="sec-tech-armamentos">
    <h3>Armamentos: Uma Guerra de Inovações Mortais</h3>

    <h4>Metralhadora</h4>
    <p>
      A <strong>metralhadora</strong> já existia antes de 1914, mas a guerra demonstrou seu poder
      devastador em escala inédita. Uma única metralhadora podia ceifar centenas de soldados avançando
      a descoberto. Foi a metralhadora, mais do que qualquer outra arma, que tornou o ataque frontal
      praticamente suicida e forçou a guerra às trincheiras.
    </p>

    <h4>Artilharia Pesada</h4>
    <p>
      A artilharia de grande calibre era responsável por <strong>cerca de 60% das baixas</strong> da guerra.
      Canhões como o alemão "<em>Big Bertha</em>" podiam bombardear alvos a dezenas de quilômetros de
      distância. O bombardeio de artilharia que antecedia as ofensivas podia durar dias ou semanas —
      mas frequentemente alertava os defensores e destruía o solo ao ponto de impossibilitar o avanço
      da própria infantaria.
    </p>

    <h4>Guerra Química</h4>
    <p>
      A introdução das <strong>armas químicas</strong> marcou um dos capítulos mais sombrios da guerra.
      Em abril de 1915, na Segunda Batalha de Ypres, os alemães liberaram uma nuvem de <strong>gás cloro</strong>
      — o primeiro uso em larga escala de armas químicas na história moderna. Soldados franceses e
      canadenses viram uma névoa amarelo-esverdeada aproximar-se das trincheiras. Muitos fugiram em pânico;
      outros foram encontrados mortos, os rostos contraídos, os pulmões destruídos.
    </p>
    <p>
      Ambos os lados logo adotaram e aperfeiçoaram as armas químicas. O <strong>gás mostarda</strong>
      (diclorodietilsulfeto), introduzido pelos alemães em 1917, era particularmente cruel: não matava
      imediatamente, mas causava cegueira temporária ou permanente, bolhas na pele e pulmões, e agonizante
      sofrimento por dias. Máscaras de gás tornaram-se equipamento padrão para todos os soldados, e o
      aviso de ataque químico — cornetas tocando em pânico ao longo das trincheiras — provocava terror.
    </p>

    <h4>Tanques</h4>
    <p>
      Desenvolvidos em segredo pelos britânicos e apelidados de "<em>tanks</em>" (tanques) para enganar
      espiões que pensassem que eram reservatórios de água, os primeiros blindados entraram em combate
      no Somme em setembro de 1916. O Mark I era lento, mecanicamente não confiável e desconfortável —
      as temperaturas internas chegavam a 50°C e as emissões de motor causavam tonturas — mas seu impacto
      psicológico sobre os soldados alemães foi imenso. Nos anos seguintes, os tanques foram aperfeiçoados
      e, em 1918, a <strong>Batalha de Amiens</strong> demonstrou seu potencial como arma decisiva de guerra.
    </p>

    <h4>Aviação</h4>
    <p>
      Os aviões de 1914 eram frágeis biplanos usados principalmente para reconhecimento. Em poucos anos,
      tornaram-se sofisticadas máquinas de guerra. Os <strong>ases da aviação</strong> — como o alemão
      Manfred von Richthofen (o "Barão Vermelho", com 80 vitórias aéreas confirmadas) e o francês
      René Fonck — tornaram-se heróis populares. Bombas eram lançadas manualmente pelos aviadores.
      Dirigíveis alemães (<em>Zeppelins</em>) realizaram os primeiros bombardeios estratégicos sobre
      cidades civis, incluindo Londres.
    </p>

    <h4>Guerra Submarina</h4>
    <p>
      Os <strong>submarinos</strong> (<em>U-boats</em>) alemães representaram uma ameaça existencial para
      o Reino Unido, que dependia de importações por mar. A campanha de guerra submarina irrestrita alemã
      afundou milhões de toneladas de navios aliados. O torpedeamento do navio de passageiros britânico
      <strong>Lusitania</strong> em maio de 1915 — com a morte de 1.198 pessoas, incluindo 128 americanos —
      chocou o mundo e contribuiu para a mudança da opinião pública americana em relação à guerra.
    </p>
  </section>

  <section id="sec-tech-sociedade">
    <h3>Transformações Sociais: A Sociedade em Guerra Total</h3>

    <h4>O Papel da Mulher</h4>
    <p>
      Com dezenas de milhões de homens enviados ao front, as mulheres preencheram os postos de trabalho
      deixados vazios. Elas operavam fábricas de munição, dirigiam bondes, trabalhavam em escritórios,
      faziam a triagem em hospitais como enfermeiras e auxiliares. Na França, na Alemanha e no Reino Unido,
      a participação feminina na força de trabalho industrial aumentou dramaticamente.
    </p>
    <p>
      Essa transformação tinha consequências políticas. Era impossível argumentar que mulheres que
      fabricavam granadas para defender a nação não mereciam o direito de voto. O movimento sufragista,
      que havia sido suprimido no início da guerra em nome da unidade nacional, colheu seus frutos no
      pós-guerra: o Reino Unido concedeu o voto às mulheres maiores de 30 anos em 1918; os EUA aprovaram
      a 19ª Emenda em 1920; a Alemanha garantiu o sufrágio feminino em 1918.
    </p>

    <h4>Propaganda</h4>
    <p>
      Todos os governos beligerantes investiram maciçamente em <strong>propaganda</strong> para manter
      o moral da população civil, recrutar soldados voluntários (especialmente no Reino Unido antes da
      conscripção obrigatória de 1916) e demonizar o inimigo. Cartazes, jornais, filmes e discursos
      políticos eram ferramentas essenciais da guerra total.
    </p>
    <p>
      O famoso cartaz britânico com o rosto de <strong>Lord Kitchener</strong> apontando o dedo e dizendo
      "Your Country Needs YOU" tornou-se um ícone. Os alemães foram frequentemente retratados como
      "Huns" bárbaros que massacravam civis belgas — relatos frequentemente exagerados ou inventados pela
      imprensa aliada. Em contrapartida, a propaganda alemã retratava a guerra como uma luta de defesa
      da <em>Kultur</em> alemã contra o imperialismo anglo-francês.
    </p>

    <h4>Economia de Guerra</h4>
    <p>
      Os governos assumiram controles sem precedentes sobre as economias nacionais. Racionamento de
      alimentos, controle de preços, direcionamento compulsório de indústrias para a produção bélica —
      tudo isso se tornou normal. A Alemanha, bloqueada pelo Poder Naval britânico, sofreu escassez
      severa de alimentos. No inverno de 1916-17, conhecido como o <strong>"inverno dos nabos"</strong>,
      a dieta de muitos alemães consistia quase exclusivamente de nabos. A fome contribuiu para o colapso
      moral e político que levaria à rendição alemã em 1918.
    </p>
  </section>

  <section class="fontes">
    <h4>Fontes e Leituras Recomendadas</h4>
    <ul>
      <li>HARRIS, J. P. <em>Douglas Haig and the First World War</em>. Cambridge: Cambridge University Press, 2008.</li>
      <li>STRACHAN, Hew. <em>The First World War</em>. Nova York: Viking, 2004. cap. 8–9.</li>
      <li>LEED, Eric J. <em>No Man's Land: Combat and Identity in World War I</em>. Cambridge: Cambridge University Press, 1979.</li>
      <li>FUSSELL, Paul. <em>The Great War and Modern Memory</em>. Oxford: Oxford University Press, 1975.</li>
      <li>WINTER, Denis. <em>Death's Men: Soldiers of the Great War</em>. Londres: Penguin, 1979.</li>
    </ul>
  </section>
</article>
"""

CONTEUDO_NO_5 = """
<article class="conteudo-no">
  <h2>A Virada e o Fim da Guerra (1917-1918)</h2>

  <section id="sec-virada-1917">
    <h3>O Ano Crucial: 1917</h3>
    <p>
      O ano de 1917 foi o ponto de inflexão da guerra. Dois eventos dramáticos e aparentemente
      contraditórios remodelariam completamente o equilíbrio de forças: a <strong>Revolução Russa</strong>
      retiraria a maior nação do mundo do lado dos Aliados, enquanto a entrada dos <strong>Estados
      Unidos</strong> traria a maior potência econômica do globo para substituí-la — e com muito mais
      além do que a Rússia poderia oferecer.
    </p>
  </section>

  <section id="sec-virada-russia">
    <h3>A Revolução Russa e a Saída da Guerra</h3>
    <p>
      Em março de 1917 (fevereiro no calendário juliano), o Czar Nicolau II foi derrubado por uma
      revolução popular alimentada pelo cansaço da guerra, pela fome e pela incompetência do regime.
      Um Governo Provisório assumiu o poder e, tragicamente para os Aliados, decidiu continuar a guerra.
    </p>
    <p>
      A decisão foi fatal. Em novembro de 1917 (outubro no calendário juliano), os <strong>Bolcheviques</strong>
      liderados por <strong>Vladimir Lenin</strong> derrubaram o Governo Provisório no que ficou conhecido
      como a Revolução de Outubro. Lenin havia retornado ao exílio na Suíça em um trem "selado"
      gentilmente providenciado pelos alemães, que esperavam que ele tirasse a Rússia da guerra.
      O cálculo alemão funcionou.
    </p>
    <p>
      Os bolcheviques prometiam "Paz, Terra e Pão" — e a paz vinha primeiro. Em março de 1918, o
      governo soviético assinou o humilhante <strong>Tratado de Brest-Litovsk</strong> com as Potências
      Centrais. A Rússia cedeu a Finlândia, os países bálticos, a Polônia, a Ucrânia e parte do
      Cáucaso — um terço de sua população europeia e uma grande parte de sua capacidade industrial.
      A Frente Oriental estava encerrada.
    </p>
    <p>
      Para a Alemanha, isso foi simultaneamente uma vitória e um equívoco estratégico. As tropas liberadas
      da Frente Oriental foram enviadas ao Ocidente, permitindo uma última grande ofensiva em 1918 —
      mas a Alemanha celebrou cedo demais, pois as tropas americanas já estavam chegando em massa.
    </p>
  </section>

  <section id="sec-virada-eua">
    <h3>A Entrada dos Estados Unidos</h3>
    <p>
      O Presidente Woodrow Wilson havia mantido os EUA neutros por quase três anos, refletindo o profundo
      isolacionismo americano. Em 1916, ele havia vencido a reeleição com o slogan "He kept us out of war"
      ("Ele nos manteve fora da guerra"). Mas dois eventos tornaram a neutralidade insustentável:
    </p>

    <h4>Guerra Submarina Irrestrita</h4>
    <p>
      Em janeiro de 1917, a Alemanha anunciou o reinício da <strong>guerra submarina irrestrita</strong> —
      afundaria qualquer navio, de qualquer nação, em zonas de guerra, incluindo embarcações americanas.
      Os alemães sabiam que isso provavelmente arrastaria os EUA para a guerra, mas apostaram que poderiam
      derrotar o Reino Unido antes que forças americanas chegassem em número suficiente para fazer
      diferença. Foi uma aposta errada.
    </p>

    <h4>O Telegrama Zimmermann</h4>
    <p>
      O <strong>Telegrama Zimmermann</strong>, interceptado pela inteligência britânica e revelado ao
      mundo em março de 1917, foi a prova mais espetacular de intenções hostis alemãs. O Ministro
      das Relações Exteriores alemão Arthur Zimmermann instruiu o embaixador alemão no México a propor
      ao governo mexicano uma aliança: se os EUA entrassem na guerra, o México declararia guerra aos
      EUA e, em troca, a Alemanha ajudaria o México a recuperar o Texas, Novo México e Arizona.
    </p>
    <p>
      A revelação do telegrama provocou indignação nos EUA, especialmente nos estados do sudoeste.
      Em <strong>6 de abril de 1917</strong>, o Congresso americano declarou guerra à Alemanha.
    </p>

    <h4>O Impacto Americano</h4>
    <p>
      Inicialmente, o impacto americano foi mais econômico e moral do que militar. Os EUA já forneciam
      enormes quantidades de material de guerra aos Aliados — e a declaração de guerra significou que
      esse fluxo não seria mais interrompido. O <strong>Corpo Expedicionário Americano</strong> (AEF),
      sob o General John "Black Jack" Pershing, começou a chegar à França em junho de 1917, mas levou
      meses para estar em força suficiente para combate.
    </p>
    <p>
      Em 1918, porém, tropas americanas frescas chegavam à França ao ritmo de 10.000 por dia. Elas
      foram cruciais para conter a última grande ofensiva alemã (Operação Michael, março-julho de 1918)
      e para a decisiva <strong>Ofensiva dos Cem Dias</strong> (agosto-novembro de 1918), que expulsou
      os alemães da França e da Bélgica e levou à rendição.
    </p>
  </section>

  <section id="sec-virada-armisticio">
    <h3>O Armistício — 11 de novembro de 1918</h3>
    <p>
      No outono de 1918, o Império Alemão estava à beira do colapso. As ofensivas aliadas avançavam
      implacavelmente. Os aliados da Alemanha rendiam-se um a um: o Império Otomano (outubro), a
      Áustria-Hungria (novembro). Em casa, a Alemanha vivia uma revolução: marinheiros em Kiel se
      amotinaram, repúblicas soviéticas eram proclamadas em cidades alemãs, e o Kaiser Wilhelm II
      abdicou e fugiu para os Países Baixos.
    </p>
    <p>
      Na madrugada de <strong>11 de novembro de 1918</strong>, representantes alemães assinaram o
      armistício em um vagão de trem do Marechal Ferdinand Foch, estacionado na floresta de Compiègne,
      no norte da França. O cessar-fogo entrou em vigor às <strong>11 horas da manhã do 11º dia
      do 11º mês</strong> — um horário escolhido por seu simbolismo poético. Ao longo das linhas de
      frente, os canhões que haviam trovejado por quatro anos calaram-se. Alguns soldados choraram;
      outros ficaram simplesmente em silêncio, sem saber como reagir ao repentino fim do inferno.
    </p>
  </section>

  <section class="fontes">
    <h4>Fontes e Leituras Recomendadas</h4>
    <ul>
      <li>KEEGAN, John. <em>A Primeira Guerra Mundial</em>. São Paulo: Companhia das Letras, 2014. cap. 10–11.</li>
      <li>STRACHAN, Hew. <em>The First World War</em>. Nova York: Viking, 2004. cap. 11.</li>
      <li>PIPES, Richard. <em>A Revolução Russa</em>. Rio de Janeiro: Record, 1997.</li>
      <li>STEVENSON, David. <em>1917: War, Peace, and Revolution</em>. Oxford: Oxford University Press, 2017.</li>
      <li>FROMKIN, David. <em>A Peace to End All Peace: The Fall of the Ottoman Empire and the Creation of the Modern Middle East</em>. Nova York: Owl Books, 2009.</li>
    </ul>
  </section>
</article>
"""

CONTEUDO_NO_6 = """
<article class="conteudo-no">
  <h2>Consequências e Legado da Primeira Guerra Mundial</h2>

  <section id="sec-conseq-mundo">
    <h3>Um Mundo Transformado</h3>
    <p>
      Quando os canhões silenciaram em novembro de 1918, o mundo era irreconhecível comparado ao de
      agosto de 1914. Quatro grandes impérios haviam desaparecido: o <strong>Russo</strong>, o
      <strong>Austro-Húngaro</strong>, o <strong>Otomano</strong> e o <strong>Alemão</strong>.
      Cerca de <strong>20 milhões de pessoas</strong> haviam morrido (10 milhões de militares e
      10 milhões de civis), e mais 21 milhões haviam ficado feridas. A pandemia de
      <strong>gripe espanhola</strong> de 1918-1919, que surgiu em parte das condições da guerra,
      matou mais 50-100 milhões em todo o mundo.
    </p>
    <p>
      A tarefa de reconstruir um mundo estilhaçado coube principalmente aos vencedores reunidos na
      <strong>Conferência de Paz de Paris</strong> (1919-1920).
    </p>
  </section>

  <section id="sec-conseq-versalhes">
    <h3>O Tratado de Versalhes (1919)</h3>
    <p>
      O tratado de paz com a Alemanha foi assinado no Salão dos Espelhos do Palácio de Versalhes em
      28 de junho de 1919 — exatamente cinco anos após o assassinato de Franz Ferdinand. Seu conteúdo
      chocou os alemães, que esperavam um tratado baseado nos "<strong>Quatorze Pontos</strong>" do
      Presidente Wilson — um plano idealista baseado na autodeterminação dos povos e na criação de
      uma organização internacional para manter a paz.
    </p>

    <h4>Cláusula da Culpa de Guerra (Artigo 231)</h4>
    <p>
      O <strong>Artigo 231</strong>, conhecido como a "Cláusula da Culpa de Guerra", declarava que a
      Alemanha e seus aliados eram responsáveis por todos os danos causados pela guerra. Essa cláusula
      era a base legal para as enormes <strong>reparações de guerra</strong> impostas à Alemanha — fixadas
      em 1921 em 132 bilhões de marcos-ouro (equivalente a aproximadamente US$ 33 bilhões, ou cerca de
      US$ 440 bilhões em valores atuais). Os alemães nunca pagaram a totalidade — o último pagamento
      das dívidas relacionadas às reparações foi feito em <strong>2010</strong>.
    </p>

    <h4>Punições Territoriais</h4>
    <p>A Alemanha perdeu aproximadamente 13% de seu território e 10% de sua população:</p>
    <ul>
      <li>A <strong>Alsácia-Lorena</strong> retornou à França (havia sido tomada em 1871).</li>
      <li>O <strong>"Corredor Polonês"</strong> deu à Polônia recém-criada acesso ao mar Báltico,
      separando a Prússia Oriental do resto da Alemanha. A cidade de Danzig tornou-se um "cidade livre"
      sob supervisão da Liga das Nações.</li>
      <li>A região do <strong>Sarre</strong> foi colocada sob administração da Liga das Nações por
      15 anos.</li>
      <li>Toda a rede colonial alemã na África e no Pacífico foi distribuída entre os Aliados como
      "mandatos" da Liga das Nações.</li>
    </ul>

    <h4>Limitações Militares</h4>
    <p>
      O exército alemão foi limitado a <strong>100.000 homens</strong>. A Alemanha foi proibida de
      ter submarinos, aviões militares e veículos blindados. A zona à margem esquerda do Reno seria
      desmilitarizada e ocupada pelos Aliados por 15 anos. O Estado-Maior alemão — cérebro da máquina
      de guerra — foi dissolvido.
    </p>
  </section>

  <section id="sec-conseq-mapa">
    <h3>O Redesenho do Mapa Europeu</h3>
    <p>
      A dissolução dos quatro impérios criou um mosaico de novos estados nacionais, frequentemente
      com fronteiras que não correspondiam às realidades étnicas e com minorias nacionais significativas:
    </p>
    <ul>
      <li><strong>Polônia</strong> ressurge como Estado independente após 123 anos de partilha.</li>
      <li><strong>Tchecoslováquia</strong> é criada, reunindo tchecos e eslovacos (com minorias alemãs
      significativas nos Sudetos).</li>
      <li><strong>Iugoslávia</strong> (Reino dos Sérvios, Croatas e Eslovenos) une povos eslavos do sul
      — uma união que provaria ser profundamente instável.</li>
      <li><strong>Áustria</strong> e <strong>Hungria</strong> tornam-se Estados separados, diminutos
      em comparação ao antigo império.</li>
      <li>Do colapso otomano emergem a <strong>Turquia</strong> moderna, o Iraque, a Síria, o Líbano
      e a Palestina (sob mandatos britânico e francês).</li>
      <li>Os países <strong>bálticos</strong> — Estônia, Letônia e Lituânia — obtêm independência da
      Rússia soviética.</li>
    </ul>
  </section>

  <section id="sec-conseq-liga">
    <h3>A Liga das Nações</h3>
    <p>
      O grande projeto idealista de Wilson, a <strong>Liga das Nações</strong>, foi criada pelo Tratado
      de Versalhes. Era a primeira organização intergovernamental global com o objetivo de manter a paz
      através do diálogo e da arbitragem coletiva. Mas nasceu defeituosa: o Senado americano, dominado
      por isolacionistas liderados pelo senador Henry Cabot Lodge, recusou-se a ratificar o Tratado de
      Versalhes, e os <strong>EUA nunca ingressaram na Liga que seu presidente havia criado</strong>.
    </p>
    <p>
      Sem os EUA (e inicialmente sem a Alemanha e a URSS), a Liga era uma casca. Quando a crise chegou
      nos anos 1930 — com o Japão invadindo a Manchúria e a Itália de Mussolini atacando a Etiópia —
      a Liga provou ser incapaz de agir efetivamente. Era apenas uma questão de tempo.
    </p>
  </section>

  <section id="sec-conseq-sementes">
    <h3>As Sementes da Segunda Guerra</h3>
    <p>
      O economista britânico <strong>John Maynard Keynes</strong>, que havia participado das negociações
      de paz em Paris e depois as denunciou em seu influente livro "<em>As Consequências Econômicas da
      Paz</em>" (1919), previu com clareza perturbadora o que estava por vir. As reparações impostas
      eram impagáveis, escreveu; elas destruiriam a economia alemã e gerariam um ressentimento que
      produziria um novo conflito.
    </p>
    <p>
      Keynes estava certo. A República de Weimar, nascida das cinzas da derrota, nunca conquistou
      legitimidade plena. A <strong>hiperinflação</strong> de 1923 destruiu as poupanças da classe média.
      A <strong>Grande Depressão</strong> de 1929 agravou o desemprego em massa. Nesse ambiente de
      desespero e humilhação nacional, um veterano condecorado e político frustrado chamado
      <strong>Adolf Hitler</strong> encontrou audiência para suas mensagens de revanchismo, antissemitismo
      e glória nacional restaurada. Vinte e um anos após o Armistício de 1918, o mundo estaria em guerra
      novamente.
    </p>
    <p>
      Por isso, muitos historiadores preferem chamar as duas guerras mundiais de uma única
      <strong>"Guerra dos Trinta Anos do século XX"</strong> (1914-1945), com um intervalo de paz
      frágil e armada entre elas. A Primeira Guerra Mundial não foi apenas uma catástrofe em si mesma —
      foi o laboratório que gerou o fascismo, o nazismo e o comunismo de guerra, e que preparou o
      terreno para uma carnificina ainda maior.
    </p>
  </section>

  <section class="fontes">
    <h4>Fontes e Leituras Recomendadas</h4>
    <ul>
      <li>MacMILLAN, Margaret. <em>Paris 1919</em>. Rio de Janeiro: Nova Fronteira, 2004.</li>
      <li>KEYNES, John Maynard. <em>As Consequências Econômicas da Paz</em>. São Paulo: Imprensa Oficial do Estado, 2002.</li>
      <li>HOBSBAWM, Eric. <em>A Era dos Extremos: O Breve Século XX (1914–1991)</em>. São Paulo: Companhia das Letras, 1995. cap. 1–3.</li>
      <li>MAZOWER, Mark. <em>A Continent in the Dark: A History of Europe in the Twentieth Century</em>. Nova York: Vintage, 1998. cap. 1.</li>
      <li>TAYLOR, A. J. P. <em>The Origins of the Second World War</em>. Nova York: Atheneum, 1961.</li>
    </ul>
  </section>
</article>
"""


# ---------------------------------------------------------------------------
# Dados dos nós e questões
# ---------------------------------------------------------------------------
# Mapeamento (índice_nó_1based, tipo, índice_questão_0based) → id da seção HTML
# Usado para indicar ao aluno qual trecho reler após errar uma questão
# ---------------------------------------------------------------------------

PARAGRAFO_REFS = {
    # Nó 1 — Contexto Pré-Guerra
    (1, "mc",   0): "sec-contexto-aliancas",
    (1, "mc",   1): "sec-contexto-imperialismo",
    (1, "mc",   2): "sec-contexto-nacionalismo",
    (1, "mc",   3): "sec-contexto-militarismo",
    (1, "open", 0): "sec-contexto-aliancas",
    (1, "open", 1): "sec-contexto-europa",
    # Nó 2 — Início da Guerra
    (2, "mc",   0): "sec-inicio-atentado",
    (2, "mc",   1): "sec-inicio-atentado",
    (2, "mc",   2): "sec-inicio-crise-julho",
    (2, "mc",   3): "sec-inicio-declaracoes",
    (2, "open", 0): "sec-inicio-declaracoes",
    (2, "open", 1): "sec-inicio-declaracoes",
    # Nó 3 — Frentes e Batalhas
    (3, "mc",   0): "sec-frentes-ocidental",
    (3, "mc",   1): "sec-frentes-trincheiras",
    (3, "mc",   2): "sec-frentes-oriental",
    (3, "mc",   3): "sec-frentes-ocidental",
    (3, "open", 0): "sec-frentes-trincheiras",
    (3, "open", 1): "sec-frentes-ocidental",
    # Nó 4 — Tecnologia e Sociedade
    (4, "mc",   0): "sec-tech-armamentos",
    (4, "mc",   1): "sec-tech-armamentos",
    (4, "mc",   2): "sec-tech-sociedade",
    (4, "mc",   3): "sec-tech-sociedade",
    (4, "open", 0): "sec-tech-armamentos",
    (4, "open", 1): "sec-tech-sociedade",
    # Nó 5 — Virada e Fim da Guerra
    (5, "mc",   0): "sec-virada-eua",
    (5, "mc",   1): "sec-virada-russia",
    (5, "mc",   2): "sec-virada-armisticio",
    (5, "mc",   3): "sec-virada-eua",
    (5, "open", 0): "sec-virada-russia",
    (5, "open", 1): "sec-virada-eua",
    # Nó 6 — Consequências e Legado
    (6, "mc",   0): "sec-conseq-versalhes",
    (6, "mc",   1): "sec-conseq-versalhes",
    (6, "mc",   2): "sec-conseq-sementes",
    (6, "mc",   3): "sec-conseq-liga",
    (6, "open", 0): "sec-conseq-sementes",
    (6, "open", 1): "sec-conseq-mapa",
}

NOS_DATA = [
    {
        "titulo": "Contexto Pré-Guerra",
        "camada": 1,
        "prerequisitos": [],
        "conteudo": CONTEUDO_NO_1,
        "questoes_mc": [
            {
                "enunciado": "Qual foi o sistema de alianças que incluía França, Rússia e Reino Unido?",
                "alternativas": [
                    {"letra": "A", "texto": "Tríplice Aliança"},
                    {"letra": "B", "texto": "Tríplice Entente"},
                    {"letra": "C", "texto": "Entente Cordiale"},
                    {"letra": "D", "texto": "Liga das Nações"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "A Tríplice Entente era formada por França, Rússia e Reino Unido. "
                    "A Tríplice Aliança incluía Alemanha, Áustria-Hungria e Itália. "
                    "A Entente Cordiale era apenas o acordo bilateral franco-britânico de 1904. "
                    "A Liga das Nações só foi criada após a guerra, em 1919."
                ),
            },
            {
                "enunciado": "O imperialismo europeu foi uma causa da Primeira Guerra Mundial porque:",
                "alternativas": [
                    {"letra": "A", "texto": "levou à cooperação econômica entre as nações"},
                    {"letra": "B", "texto": "reduziu as tensões entre as potências europeias"},
                    {"letra": "C", "texto": "criou rivalidades intensas por territórios coloniais"},
                    {"letra": "D", "texto": "promoveu o pacifismo e a diplomacia multilateral"},
                ],
                "resposta_correta": "C",
                "feedback_erro": (
                    "A corrida colonial criou rivalidades intensas, especialmente entre a Alemanha — "
                    "que se unificou tardiamente em 1871 e sentia-se em desvantagem — e as potências "
                    "coloniais estabelecidas como França e Reino Unido. As Crises Marroquinas de 1905 "
                    "e 1911 quase desencadearam conflitos abertos."
                ),
            },
            {
                "enunciado": (
                    "Qual ideologia pregava a independência de grupos étnicos e nacionais, "
                    "contribuindo para as tensões nos Bálcãs antes de 1914?"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Liberalismo econômico"},
                    {"letra": "B", "texto": "Socialismo internacional"},
                    {"letra": "C", "texto": "Nacionalismo"},
                    {"letra": "D", "texto": "Conservadorismo monárquico"},
                ],
                "resposta_correta": "C",
                "feedback_erro": (
                    "O nacionalismo, especialmente nos Bálcãs dominados pelo Império Austro-Húngaro, "
                    "alimentava movimentos independentistas de sérvios, croatas, bósnios e outros povos "
                    "eslavos. A Sérvia sonhava em unir todos os eslavos do sul em um grande Estado, "
                    "ameaçando diretamente a integridade do Império Austro-Húngaro."
                ),
            },
            {
                "enunciado": (
                    "Quais duas potências rivalizavam mais intensamente pela hegemonia naval "
                    "no início do século XX?"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "França e Rússia"},
                    {"letra": "B", "texto": "Alemanha e Reino Unido"},
                    {"letra": "C", "texto": "Áustria-Hungria e Itália"},
                    {"letra": "D", "texto": "Estados Unidos e Japão"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "A Alemanha, sob o Kaiser Wilhelm II, lançou um ambicioso programa de construção "
                    "naval (Lei Naval de 1898 e 1900) para desafiar a supremacia britânica nos mares. "
                    "O Reino Unido respondeu com o programa de construção dos 'Dreadnoughts'. Essa "
                    "corrida armamentista naval aprofundou a desconfiança entre as duas potências."
                ),
            },
        ],
        "questoes_abertas": [
            {
                "enunciado": (
                    "Explique como o sistema de alianças europeu contribuiu para transformar "
                    "um conflito regional nos Bálcãs em uma guerra de escala mundial."
                ),
                "palavras_chave": [
                    "alianças", "Tríplice", "cadeia", "mobilização", "obrigações",
                    "tratados", "entente", "bloco", "escalonamento",
                ],
            },
            {
                "enunciado": (
                    "Quais eram as principais tensões geopolíticas na Europa antes de 1914? "
                    "Cite ao menos três fatores e explique como cada um contribuiu para o caminho à guerra."
                ),
                "palavras_chave": [
                    "imperialismo", "colonialismo", "corrida armamentista", "Bálcãs",
                    "rivalidade", "naval", "nacionalismo", "militarismo",
                ],
            },
        ],
    },
    {
        "titulo": "Início da Guerra",
        "camada": 2,
        "prerequisitos": [1],
        "conteudo": CONTEUDO_NO_2,
        "questoes_mc": [
            {
                "enunciado": "O Arquiduque Franz Ferdinand foi assassinado em qual cidade?",
                "alternativas": [
                    {"letra": "A", "texto": "Viena, capital do Império Austro-Húngaro"},
                    {"letra": "B", "texto": "Berlim, capital do Império Alemão"},
                    {"letra": "C", "texto": "Sarajevo, capital da Bósnia"},
                    {"letra": "D", "texto": "Belgrado, capital da Sérvia"},
                ],
                "resposta_correta": "C",
                "feedback_erro": (
                    "O Arquiduque Franz Ferdinand foi assassinado em Sarajevo, capital da Bósnia "
                    "(então parte do Império Austro-Húngaro), em 28 de junho de 1914. A data era "
                    "politicamente simbólica: o Dia de São Vito, aniversário da Batalha do Kosovo "
                    "(1389), símbolo sagrado do nacionalismo sérvio."
                ),
            },
            {
                "enunciado": "Quem assassinou o Arquiduque Franz Ferdinand em 1914?",
                "alternativas": [
                    {"letra": "A", "texto": "Um espião alemão a mando do Kaiser Wilhelm II"},
                    {"letra": "B", "texto": "Gavrilo Princip, nacionalista bósnio ligado à Mão Negra"},
                    {"letra": "C", "texto": "Um oficial do exército russo"},
                    {"letra": "D", "texto": "Um anarquista francês antimonárquico"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "Gavrilo Princip, um jovem nacionalista bósnio de 19 anos, ligado à organização "
                    "secreta sérvica 'Mão Negra' (Ujedinjenje ili smrt — Unificação ou Morte), "
                    "realizou o atentado. Ele fazia parte de um grupo de sete conspiradores posicionados "
                    "ao longo do trajeto do arquiduque."
                ),
            },
            {
                "enunciado": (
                    "O ultimato austro-húngaro enviado à Sérvia após o assassinato de Franz Ferdinand "
                    "foi considerado:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Razoável e aceito integralmente pela Sérvia"},
                    {"letra": "B", "texto": "Humilhante; a Sérvia aceitou a maioria, mas recusou pontos que violavam sua soberania"},
                    {"letra": "C", "texto": "Ignorado completamente pelo governo sérvio"},
                    {"letra": "D", "texto": "Aprovado sem reservas por todas as potências europeias"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "O ultimato austro-húngaro de 23 de julho de 1914 continha dez exigências de 48 horas. "
                    "A Sérvia aceitou nove, mas recusou permitir que funcionários austro-húngaros "
                    "investigassem em seu território — o que violaria sua soberania. A Áustria-Hungria, "
                    "que desejava a guerra, considerou a resposta insatisfatória e declarou guerra."
                ),
            },
            {
                "enunciado": (
                    "Qual foi a primeira declaração de guerra formal após o assassinato de Franz Ferdinand?"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Alemanha declara guerra à França"},
                    {"letra": "B", "texto": "Rússia declara guerra à Áustria-Hungria"},
                    {"letra": "C", "texto": "Áustria-Hungria declara guerra à Sérvia"},
                    {"letra": "D", "texto": "Reino Unido declara guerra à Alemanha"},
                ],
                "resposta_correta": "C",
                "feedback_erro": (
                    "A Áustria-Hungria declarou guerra à Sérvia em 28 de julho de 1914 — exatamente um "
                    "mês após o assassinato do arquiduque. O sistema de alianças então entrou em ação: "
                    "a Rússia mobilizou para defender a Sérvia; a Alemanha declarou guerra à Rússia e "
                    "depois à França; o Reino Unido entrou ao lado dos aliados após a invasão alemã da Bélgica."
                ),
            },
        ],
        "questoes_abertas": [
            {
                "enunciado": (
                    "Por que o assassinato de um arquiduque austríaco em Sarajevo levou a uma "
                    "guerra mundial em apenas algumas semanas? Explique o efeito dominó das alianças."
                ),
                "palavras_chave": [
                    "alianças", "mobilização", "ultimato", "Sérvia", "Rússia",
                    "Alemanha", "obrigações", "efeito dominó", "cheque em branco",
                ],
            },
            {
                "enunciado": (
                    "Descreva as declarações de guerra em cadeia ocorridas em julho e agosto de 1914, "
                    "identificando as principais nações envolvidas e os motivos de cada entrada no conflito."
                ),
                "palavras_chave": [
                    "Áustria", "Sérvia", "Rússia", "Alemanha", "França",
                    "Bélgica", "Reino Unido", "agosto", "Plano Schlieffen",
                ],
            },
        ],
    },
    {
        "titulo": "Frentes e Batalhas",
        "camada": 3,
        "prerequisitos": [2],
        "conteudo": CONTEUDO_NO_3,
        "questoes_mc": [
            {
                "enunciado": "A Batalha de Verdun (1916) ficou conhecida principalmente por:",
                "alternativas": [
                    {"letra": "A", "texto": "Ser o primeiro uso pioneiro de tanques em combate"},
                    {"letra": "B", "texto": "Ser uma das batalhas mais longas e sangrentas de toda a guerra"},
                    {"letra": "C", "texto": "Representar uma vitória decisiva e rápida dos aliados"},
                    {"letra": "D", "texto": "Marcar a entrada dos EUA no conflito europeu"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "Verdun durou de fevereiro a dezembro de 1916 — dez meses de combate contínuo — "
                    "com cerca de 700.000 baixas combinadas (mortos, feridos e desaparecidos). "
                    "O General alemão Falkenhayn planejou a batalha para 'sangrar o exército francês "
                    "até a morte' em uma estratégia de guerra de desgaste. Tornou-se símbolo do horror "
                    "das trincheiras e do absurdo da guerra industrial."
                ),
            },
            {
                "enunciado": "A guerra de trincheiras na Frente Ocidental resultou principalmente em:",
                "alternativas": [
                    {"letra": "A", "texto": "Avanços rápidos e decisivos dos exércitos atacantes"},
                    {"letra": "B", "texto": "Uma guerra de movimento constante e fluida"},
                    {"letra": "C", "texto": "Um impasse prolongado e guerra de desgaste devastadora"},
                    {"letra": "D", "texto": "Vitória alemã decisiva ainda em 1915"},
                ],
                "resposta_correta": "C",
                "feedback_erro": (
                    "As trincheiras criaram uma linha de frente praticamente estática por quatro anos. "
                    "Imensos recursos humanos e materiais eram consumidos para ganhos territoriais mínimos, "
                    "frequentemente medidos em metros. A metralhadora, as redes de arame farpado e a "
                    "artilharia pesada tornavam o ataque frontal devastadoramente custoso para o lado atacante."
                ),
            },
            {
                "enunciado": (
                    "A Frente Oriental diferenciava-se da Frente Ocidental principalmente por:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Ausência total de trincheiras e combate urbano"},
                    {"letra": "B", "texto": "Maior mobilidade das tropas e vasto território de operações"},
                    {"letra": "C", "texto": "Número significativamente menor de baixas militares"},
                    {"letra": "D", "texto": "Participação decisiva das forças armadas americanas"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "A Frente Oriental estendia-se por milhares de quilômetros — da costa do Báltico ao "
                    "Mar Negro —, o que permitia mais movimento e flutuação das linhas de frente em "
                    "comparação com o impasse relativamente estático da Frente Ocidental. Porém, também "
                    "foi extremamente sangrenta, com a Rússia sofrendo perdas devastadoras que contribuíram "
                    "para a Revolução de 1917."
                ),
            },
            {
                "enunciado": "Qual foi o principal objetivo estratégico da ofensiva aliada no Rio Somme em 1916?",
                "alternativas": [
                    {"letra": "A", "texto": "Liberar Paris do cerco alemão iminente"},
                    {"letra": "B", "texto": "Aliviar a pressão sobre as forças francesas em Verdun"},
                    {"letra": "C", "texto": "Abrir um caminho direto para Berlim"},
                    {"letra": "D", "texto": "Defender a Bélgica da invasão alemã"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "A ofensiva britânica e francesa no Rio Somme (julho-novembro de 1916) foi lançada "
                    "principalmente para aliviar a pressão sobre o exército francês, que estava sendo "
                    "destruído na Batalha de Verdun. O primeiro dia do Somme (1 de julho) foi o mais "
                    "sangrento da história militar britânica, com cerca de 57.470 baixas em um único dia."
                ),
            },
        ],
        "questoes_abertas": [
            {
                "enunciado": (
                    "Descreva as condições de vida dos soldados nas trincheiras da Primeira "
                    "Guerra Mundial. Que desafios físicos e psicológicos eles enfrentavam?"
                ),
                "palavras_chave": [
                    "lama", "ratos", "doenças", "bombas", "gás", "frio", "trauma",
                    "No Man's Land", "piolhos", "shell shock", "pé de trincheira",
                ],
            },
            {
                "enunciado": (
                    "Como a Batalha do Somme exemplifica as estratégias e os custos humanos "
                    "da guerra de trincheiras? Analise as causas do alto número de baixas."
                ),
                "palavras_chave": [
                    "Somme", "1916", "baixas", "ofensiva", "artilharia",
                    "arame farpado", "impasse", "britânicos", "metralhadora",
                ],
            },
        ],
    },
    {
        "titulo": "Tecnologia e Sociedade",
        "camada": 4,
        "prerequisitos": [2],
        "conteudo": CONTEUDO_NO_4,
        "questoes_mc": [
            {
                "enunciado": (
                    "Qual batalha marcou o primeiro uso em larga escala de gás venenoso "
                    "como arma de guerra?"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Primeira Batalha do Marne (1914)"},
                    {"letra": "B", "texto": "Segunda Batalha de Ypres (1915)"},
                    {"letra": "C", "texto": "Batalha de Verdun (1916)"},
                    {"letra": "D", "texto": "Batalha do Somme (1916)"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "O gás cloro foi utilizado pelos alemães na Segunda Batalha de Ypres, em abril de 1915, "
                    "representando o primeiro uso em larga escala de armas químicas na história moderna. "
                    "Uma nuvem amarelo-esverdeada avançou sobre as trincheiras francesas e canadenses, "
                    "causando pânico e mortes. Ambos os lados logo adotaram e aperfeiçoaram as armas "
                    "químicas, incluindo o devastador gás mostarda."
                ),
            },
            {
                "enunciado": "Os tanques foram utilizados pela primeira vez em combate em qual batalha?",
                "alternativas": [
                    {"letra": "A", "texto": "Batalha de Verdun (fevereiro de 1916)"},
                    {"letra": "B", "texto": "Primeira Batalha do Marne (setembro de 1914)"},
                    {"letra": "C", "texto": "Batalha do Somme (setembro de 1916)"},
                    {"letra": "D", "texto": "Batalha de Passchendaele (1917)"},
                ],
                "resposta_correta": "C",
                "feedback_erro": (
                    "O Reino Unido introduziu os tanques Mark I na Batalha do Somme em setembro de 1916. "
                    "Foram usados em pequeno número (49 veículos) e sofreram com problemas mecânicos, "
                    "mas seu impacto psicológico sobre os soldados alemães foi significativo. O potencial "
                    "dos tanques só seria plenamente demonstrado na Batalha de Amiens em 1918."
                ),
            },
            {
                "enunciado": (
                    "O papel das mulheres na sociedade mudou durante a Primeira Guerra Mundial "
                    "principalmente porque:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "As mulheres participaram diretamente das batalhas nas frentes de combate"},
                    {"letra": "B", "texto": "Ocuparam postos de trabalho nas fábricas e serviços deixados pelos homens que foram à guerra"},
                    {"letra": "C", "texto": "Os governos proibiram formalmente as mulheres de trabalhar durante o conflito"},
                    {"letra": "D", "texto": "Não houve mudanças significativas no papel feminino durante o conflito"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "Com dezenas de milhões de homens enviados ao front, as mulheres preencheram os postos "
                    "de trabalho nas fábricas de munição, transportes, escritórios e hospitais. Essa "
                    "transformação tornou insustentável o argumento contra o sufrágio feminino, contribuindo "
                    "para que o Reino Unido concedesse o voto às mulheres em 1918, os EUA em 1920 e a "
                    "Alemanha em 1918."
                ),
            },
            {
                "enunciado": (
                    "A propaganda durante a Primeira Guerra Mundial servia principalmente para:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Informar a população de forma objetiva e imparcial sobre as batalhas"},
                    {"letra": "B", "texto": "Recrutar soldados, manter o apoio popular e demonizar o inimigo"},
                    {"letra": "C", "texto": "Negociar acordos de paz entre as potências beligerantes"},
                    {"letra": "D", "texto": "Comunicar movimentos táticos militares secretos aos aliados"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "A propaganda era uma ferramenta essencial da 'guerra total'. Os governos investiam "
                    "maciçamente em cartazes, filmes, jornais e discursos para recrutar voluntários "
                    "(especialmente no Reino Unido antes da conscripção de 1916), manter o moral civil "
                    "e desumanizar o inimigo. A informação era rigidamente controlada e frequentemente "
                    "distorcida para servir aos objetivos nacionais."
                ),
            },
        ],
        "questoes_abertas": [
            {
                "enunciado": (
                    "Como as novas tecnologias militares desenvolvidas durante a Primeira Guerra Mundial "
                    "mudaram a natureza do combate? Analise ao menos três inovações e seus impactos."
                ),
                "palavras_chave": [
                    "tanques", "aviação", "gás", "metralhadora", "artilharia",
                    "submarinos", "guerra química", "inovação", "Ypres",
                ],
            },
            {
                "enunciado": (
                    "Quais foram as principais transformações sociais causadas pela Primeira Guerra "
                    "Mundial no papel e na posição das mulheres na sociedade europeia?"
                ),
                "palavras_chave": [
                    "trabalho", "fábricas", "sufrágio", "independência", "enfermeiras",
                    "emancipação", "direitos", "voto", "pós-guerra",
                ],
            },
        ],
    },
    {
        "titulo": "Virada e Fim da Guerra",
        "camada": 5,
        "prerequisitos": [3, 4],
        "conteudo": CONTEUDO_NO_5,
        "questoes_mc": [
            {
                "enunciado": (
                    "Os Estados Unidos entraram na Primeira Guerra Mundial em 1917 "
                    "motivados principalmente por:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Ataque japonês a bases militares americanas no Pacífico"},
                    {"letra": "B", "texto": "Guerra submarina irrestrita alemã e o Telegrama Zimmermann"},
                    {"letra": "C", "texto": "Invasão francesa de territórios americanos no Caribe"},
                    {"letra": "D", "texto": "Pedido formal de ajuda militar do governo britânico"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "Dois fatores decisivos motivaram a entrada americana: (1) o reinício da guerra submarina "
                    "irrestrita alemã em janeiro de 1917, que ameaçava navios americanos; e (2) o Telegrama "
                    "Zimmermann, interceptado pelos britânicos, no qual a Alemanha propunha ao México uma "
                    "aliança contra os EUA em troca da recuperação do Texas, Novo México e Arizona. "
                    "O Congresso declarou guerra em 6 de abril de 1917."
                ),
            },
            {
                "enunciado": (
                    "A Revolução Russa de 1917 resultou em qual consequência para o curso da guerra?"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Maior participação russa na Frente Oriental com novas ofensivas"},
                    {"letra": "B", "texto": "Retirada da Rússia da guerra com a assinatura do Tratado de Brest-Litovsk"},
                    {"letra": "C", "texto": "Vitória imediata dos Aliados na Frente Oriental"},
                    {"letra": "D", "texto": "Aliança militar formal entre a Rússia soviética e a Alemanha"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "Os bolcheviques, ao tomar o poder em novembro de 1917, prometiam 'Paz, Terra e Pão'. "
                    "Em março de 1918, assinaram o Tratado de Brest-Litovsk com as Potências Centrais, "
                    "retirando a Rússia da guerra. A Rússia cedeu enormes territórios (Finlândia, países "
                    "bálticos, Polônia, Ucrânia), encerrando a Frente Oriental e liberando tropas alemãs "
                    "para o Ocidente."
                ),
            },
            {
                "enunciado": (
                    "O Armistício que encerrou a Primeira Guerra Mundial foi assinado em:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Versalhes, no Salão dos Espelhos do palácio real"},
                    {"letra": "B", "texto": "Berlim, na sede do governo alemão"},
                    {"letra": "C", "texto": "Um vagão de trem na floresta de Compiègne, no norte da França"},
                    {"letra": "D", "texto": "Londres, no Parlamento britânico"},
                ],
                "resposta_correta": "C",
                "feedback_erro": (
                    "O armistício foi assinado na madrugada de 11 de novembro de 1918, em um vagão de trem "
                    "do Marechal Ferdinand Foch, estacionado na floresta de Compiègne, no norte da França. "
                    "O cessar-fogo entrou em vigor às 11 horas da manhã — 'na 11ª hora do 11º dia do 11º mês' — "
                    "um horário escolhido por seu simbolismo poético."
                ),
            },
            {
                "enunciado": (
                    "Por que a entrada dos Estados Unidos foi decisiva para o resultado da guerra?"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "As tropas americanas já combatiam na Europa desde 1915"},
                    {"letra": "B", "texto": "Reforçaram os Aliados com tropas frescas e recursos quando França e Reino Unido estavam exaustos"},
                    {"letra": "C", "texto": "O exército americano derrotou sozinho as forças alemãs na Frente Ocidental"},
                    {"letra": "D", "texto": "Os EUA tiveram papel exclusivamente naval, não enviando tropas terrestres"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "Em 1917-1918, os exércitos francês e britânico estavam exaustos após anos de combate "
                    "devastador. A chegada de tropas americanas frescas — ao ritmo de 10.000 por dia em "
                    "1918 — e o enorme poder industrial americano reverteram o equilíbrio de forças. "
                    "As tropas do Corpo Expedicionário Americano (AEF) foram cruciais na contenção da "
                    "última ofensiva alemã e na decisiva Ofensiva dos Cem Dias."
                ),
            },
        ],
        "questoes_abertas": [
            {
                "enunciado": (
                    "Por que a Revolução Russa de 1917 e a retirada da Rússia da guerra mudaram "
                    "fundamentalmente o curso do conflito? Quais foram as consequências para ambos os lados?"
                ),
                "palavras_chave": [
                    "bolcheviques", "Lênin", "Brest-Litovsk", "retirada", "frente oriental",
                    "Alemanha", "paz", "tropas", "Ocidente",
                ],
            },
            {
                "enunciado": (
                    "Como a entrada dos Estados Unidos na guerra em 1917 alterou o equilíbrio "
                    "de forças entre os Aliados e as Potências Centrais?"
                ),
                "palavras_chave": [
                    "EUA", "Wilson", "tropas", "recursos", "moral", "submarinos",
                    "Zimmermann", "Aliados", "AEF", "Pershing",
                ],
            },
        ],
    },
    {
        "titulo": "Consequências e Legado",
        "camada": 6,
        "prerequisitos": [5],
        "conteudo": CONTEUDO_NO_6,
        "questoes_mc": [
            {
                "enunciado": (
                    "O Artigo 231 do Tratado de Versalhes ficou historicamente conhecido como:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Cláusula da Paz Perpétua"},
                    {"letra": "B", "texto": "Cláusula da Culpa de Guerra"},
                    {"letra": "C", "texto": "Artigo da Autodeterminação dos Povos"},
                    {"letra": "D", "texto": "Cláusula Wilson dos Quatorze Pontos"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "O Artigo 231 do Tratado de Versalhes declarava que a Alemanha e seus aliados eram "
                    "responsáveis por todos os danos causados pela guerra — a chamada 'Cláusula da Culpa de "
                    "Guerra'. Era a base legal para as reparações de guerra impostas à Alemanha, fixadas em "
                    "1921 em 132 bilhões de marcos-ouro. Os alemães consideraram o artigo profundamente "
                    "humilhante e injusto."
                ),
            },
            {
                "enunciado": (
                    "Qual foi a principal consequência territorial para a Alemanha imposta "
                    "pelo Tratado de Versalhes?"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "A Alemanha ganhou novos territórios na Europa Central"},
                    {"letra": "B", "texto": "Perdeu colônias, a Alsácia-Lorena e o corredor polonês, entre outras regiões"},
                    {"letra": "C", "texto": "A Alemanha manteve todos os seus territórios, mas pagou reparações"},
                    {"letra": "D", "texto": "Recebeu territórios austro-húngaros como compensação"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "A Alemanha perdeu aproximadamente 13% de seu território e 10% de sua população. "
                    "A Alsácia-Lorena retornou à França (havia sido tomada em 1871). O 'corredor polonês' "
                    "deu à Polônia acesso ao mar Báltico, separando a Prússia Oriental. Toda a rede colonial "
                    "alemã foi distribuída entre os Aliados. A zona às margens do Reno foi desmilitarizada."
                ),
            },
            {
                "enunciado": (
                    "O Tratado de Versalhes plantou 'sementes' da Segunda Guerra Mundial principalmente porque:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "Criou a OTAN e militarizou a Europa Ocidental"},
                    {"letra": "B", "texto": "Humilhou e empobreceu a Alemanha, alimentando o ressentimento que favoreceu o nazismo"},
                    {"letra": "C", "texto": "Uniu as nações europeias em um projeto de integração supranacional"},
                    {"letra": "D", "texto": "Aboliu os exércitos nacionais, deixando a Europa indefesa"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "As pesadas reparações, as humilhações territoriais e as cláusulas militares geraram "
                    "uma grave crise econômica e política na Alemanha — hiperinflação em 1923, desemprego "
                    "em massa na Grande Depressão. Esse ambiente de desespero e humilhação foi terreno fértil "
                    "para o nazismo. O economista Keynes previu em 1919 que as condições do tratado "
                    "levariam a um novo conflito."
                ),
            },
            {
                "enunciado": (
                    "A Liga das Nações, proposta por Woodrow Wilson, teve sua efetividade "
                    "gravemente limitada principalmente porque:"
                ),
                "alternativas": [
                    {"letra": "A", "texto": "A Alemanha assumiu o controle da organização logo após sua fundação"},
                    {"letra": "B", "texto": "O Senado americano se recusou a ratificar a entrada dos EUA na Liga"},
                    {"letra": "C", "texto": "A Rússia soviética presidiu a organização e bloqueou decisões"},
                    {"letra": "D", "texto": "A Liga não teve nenhum membro fundador de relevância"},
                ],
                "resposta_correta": "B",
                "feedback_erro": (
                    "Ironicamente, os EUA — cujo presidente Wilson havia proposto e defendido a criação "
                    "da Liga — nunca ingressaram na organização. O Senado americano, dominado por "
                    "isolacionistas liderados pelo senador Henry Cabot Lodge, se recusou a ratificar o "
                    "Tratado de Versalhes em 1919 e 1920. Sem a potência mais poderosa do mundo, "
                    "a Liga nasceu enfraquecida e provou ser incapaz de conter as agressões dos anos 1930."
                ),
            },
        ],
        "questoes_abertas": [
            {
                "enunciado": (
                    "Analise como o Tratado de Versalhes e suas consequências econômicas e políticas "
                    "contribuíram para o surgimento do nazismo e, em última análise, da Segunda Guerra Mundial."
                ),
                "palavras_chave": [
                    "reparações", "humilhação", "crise econômica", "Hitler", "nazismo",
                    "ressentimento", "culpa", "Alemanha", "Weimar", "hiperinflação",
                ],
            },
            {
                "enunciado": (
                    "Como a Primeira Guerra Mundial redesenhou o mapa político da Europa e do "
                    "Oriente Médio? Quais impérios desapareceram e quais novos Estados surgiram?"
                ),
                "palavras_chave": [
                    "impérios", "Austro-Húngaro", "Otomano", "Russo", "novos países",
                    "fronteiras", "autodeterminação", "Polônia", "Iugoslávia", "Tchecoslováquia",
                ],
            },
        ],
    },
]


# ---------------------------------------------------------------------------
# Função principal de seed
# ---------------------------------------------------------------------------

def seed_database():
    with app.app_context():
        # Garante que as tabelas existem
        db.create_all()

        # Verifica se já foi populado
        if NoDominio.query.count() > 0:
            print("Banco de dados já populado. Nada a fazer.")
            print(f"  Nós existentes: {NoDominio.query.count()}")
            print(f"  Questões existentes: {Questao.query.count()}")
            return

        print("Iniciando população do banco de dados...")

        nos_criados = {}

        for idx, no_data in enumerate(NOS_DATA, start=1):
            print(f"\n[{idx}/6] Criando nó: {no_data['titulo']}")

            # Resolve IDs reais de prerequisitos a partir dos índices temporários
            prereq_ids = []
            for temp_id in no_data["prerequisitos"]:
                if temp_id in nos_criados:
                    prereq_ids.append(nos_criados[temp_id].id)

            no = NoDominio(
                titulo=no_data["titulo"],
                camada=no_data["camada"],
                conteudo=no_data["conteudo"],
            )
            no.prerequisitos = prereq_ids
            db.session.add(no)
            db.session.flush()  # Obtém o ID gerado

            # Registra o mapeamento idx → objeto
            nos_criados[idx] = no

            # Atualiza os prereqs com IDs reais agora que temos o id do nó atual
            # (para os próximos nós que apontarem para este)
            print(f"   Nó criado com ID={no.id}, prerequisitos={prereq_ids}")

            # Questões de múltipla escolha
            for q_idx, q_data in enumerate(no_data["questoes_mc"]):
                q = Questao(
                    no_id=no.id,
                    tipo="multipla_escolha",
                    enunciado=q_data["enunciado"],
                    resposta_correta=q_data["resposta_correta"],
                    feedback_erro=q_data["feedback_erro"],
                    paragrafo_ref=PARAGRAFO_REFS.get((idx, "mc", q_idx)),
                )
                q.alternativas = q_data["alternativas"]
                q.palavras_chave = []
                db.session.add(q)
                print(f"   + MC [{q.paragrafo_ref}]: {q_data['enunciado'][:50]}...")

            # Questões abertas
            for q_idx, q_data in enumerate(no_data["questoes_abertas"]):
                q = Questao(
                    no_id=no.id,
                    tipo="aberta",
                    enunciado=q_data["enunciado"],
                    resposta_correta=None,
                    feedback_erro=None,
                    paragrafo_ref=PARAGRAFO_REFS.get((idx, "open", q_idx)),
                )
                q.alternativas = []
                q.palavras_chave = q_data["palavras_chave"]
                db.session.add(q)
                print(f"   + Aberta [{q.paragrafo_ref}]: {q_data['enunciado'][:50]}...")

        db.session.commit()
        print(f"\nSeed concluído com sucesso!")
        print(f"  Nós criados: {NoDominio.query.count()}")
        print(f"  Questões criadas: {Questao.query.count()}")


if __name__ == "__main__":
    seed_database()
