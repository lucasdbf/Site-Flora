# Prompt para o Claude Design: modelo 3D da camiseta Florá

Anexar: (1) o PNG da camiseta real, (2) a imagem de referência da camiseta preta.

```
# TAREFA

Crie um modelo 3D realista e profissional de uma camiseta branca de manga curta para exibição interativa em uma página web (three.js). A qualidade visual alvo é a da imagem de referência anexa (camiseta preta, render de estúdio): volume natural, caimento do tecido, dobras suaves, costuras e acabamentos visíveis. Não copie a cor preta nem a pose: copie o nível de qualidade e realismo.

# ANEXOS

1. REFERÊNCIA DE QUALIDADE (camiseta preta): usar só como alvo de forma, caimento, acabamento e iluminação. Não é para reproduzir a cor.
2. PNG DA CAMISETA REAL (branca, com bordado): fonte do bordado e da cor do tecido.

# O QUE DEVE SER IGUAL À CAMISETA REAL

- Camiseta branca, gola redonda, manga curta, modelagem reta e solta.
- No peito, do lado esquerdo de quem veste (lado direito de quem olha de frente), há um laço dourado bordado e, ao lado dele, um coração vermelho só de contorno. Posição, tamanho e proporção iguais ao PNG.
- Costas totalmente lisas, sem estampa nem bordado.

# TRATAMENTO DO PNG (importante)

NÃO use a foto inteira como textura do corpo: ela traz sombras e dobras fotografadas que ficariam "coladas" no modelo e brigariam com a iluminação 3D.
1. Extraia do PNG apenas o laço e o coração, em um recorte limpo com canal alfa (fundo transparente), na maior resolução que o arquivo permitir. Remova qualquer sombra do tecido ao redor.
2. Aplique esse recorte como decalque sobre o tecido branco: base color do bordado + normal map leve que dê relevo de fio bordado (pontos de cetim), ligeiramente acima da superfície.
3. O tecido branco é procedural/PBR: branco levemente quente (#f4f1ec, nunca #ffffff puro, para não estourar a luz), sem textura fotográfica.

# FORMA E MODELAGEM (o que mais importa)

- Volume orgânico, não "inflado": a camiseta deve parecer vestida em um corpo invisível (efeito ghost mannequin). Ombros caídos naturalmente, peito e tronco levemente arredondados, barra mais solta que o peito.
- Dobras e vincos realistas: tensão leve nos ombros e axilas, dobras suaves na cintura e na barra, caimento das mangas com um pouco de folga. Assimetria sutil entre os lados, para não parecer simétrico demais. Sem dobras exageradas e sem aspecto amassado.
- Mangas: boca da manga com bainha dobrada para dentro, com costura dupla visível, espessura real na borda e interior visível (o tecido tem espessura, não é uma casca de espessura zero).
- Gola: tira de ribana (malha canelada) com espessura real, ligeiramente mais escura/densa que o corpo, costura de acabamento, e o avesso da gola visível na parte de trás do pescoço, como no modelo de referência.
- Barra: bainha dobrada com costura dupla.
- Costuras: ombro, lateral e cava com linha de costura sutil (relevo no normal map ou geometria fina).
- Interior: as aberturas (pescoço, mangas, barra) mostram o interior do tecido, com sombreamento próprio. Nada de buracos vazios nem normais invertidas.
- Silhueta limpa e lisa em todas as bordas. NÃO derive o contorno de máscara de imagem: nada de borda serrilhada ou escadinha.

# MATERIAL (PBR)

- Algodão jersey branco: roughness alta (0,75 a 0,9), metalness 0.
- Sheen (brilho de tecido) sutil nas bordas, via KHR_materials_sheen, para dar aquele halo macio de tecido.
- Normal map de trama de malha jersey (tricô fino, em escala realista) em todo o corpo; gola com trama canelada mais marcada.
- Leve variação de roughness para evitar aspecto de plástico.
- Oclusão ambiente (AO) assada nas dobras, axilas, gola e bainhas.

# TÉCNICO / ENTREGA

- Formato: GLB (glTF 2.0 binário), pronto para three.js (GLTFLoader).
- Orientação: frente da camiseta voltada para +Z, eixo Y para cima, base da barra em y = 0, centro em x = 0, escala em metros (camiseta com aproximadamente 0,72 m de largura × 0,70 m de altura).
- Pivô no centro, para que girar em torno do eixo Y funcione bem.
- Nós: "Camiseta" (corpo + mangas) e "Gola". Materiais: "Corpo", "Gola", "Bordado".
- UVs sem sobreposição e sem esticamento visível.
- Geometria: até 80 mil triângulos no total, topologia limpa, normais suaves e consistentes.
- Texturas: máximo 2048×2048 por mapa (base color, normal, ORM) e 4096 apenas para o bordado, se necessário. Formato JPEG/PNG ou KTX2.
- Peso total do GLB: ideal abaixo de 4 MB, máximo 6 MB.
- Sem fundo, sem chão, sem manequim, sem luzes ou câmeras dentro do arquivo.
- Sem violeta ou roxo em nenhum material.

# COMO PROCEDER

1. Antes de modelar, descreva em 5 a 8 linhas o que observou na referência (silhueta, onde estão as dobras, acabamento da gola e da manga) e como pretende reproduzir.
2. Modele, e renderize turntable de verificação: frente, 3/4 esquerda, 3/4 direita, lateral, costas e detalhe de gola e bordado, com iluminação de estúdio suave (key + fill + rim) sobre fundo cinza-claro neutro.
3. Compare cada render com a referência e corrija o que destoar antes de entregar.

# CRITÉRIOS DE ACEITE (confira e liste um a um na resposta final)

[ ] Em render 3/4, a camiseta tem qualidade comparável à referência, sem aspecto de "low poly" ou de "balão inflado".
[ ] Silhueta lisa, sem serrilhado.
[ ] Gola com espessura e avesso visível; mangas e barra com bainha e costura dupla.
[ ] Dobras naturais e levemente assimétricas.
[ ] Bordado do laço dourado e do coração vermelho nítido, no lado certo do peito, com relevo.
[ ] Costas lisas.
[ ] Branco não estourado nas áreas iluminadas (nenhum pixel chapado em #fff).
[ ] GLB abre sem erros e respeita orientação, escala, nomes e limites de peso.

# O QUE NÃO FAZER

- Não usar a foto da camiseta como textura do corpo.
- Não gerar camiseta preta ou de outra cor.
- Não entregar casca de espessura zero.
- Não simplificar a gola em um anel liso.
- Não deixar o modelo perfeitamente simétrico e plano.

Se algo da referência ou do PNG estiver ambíguo, escolha a opção mais fiel à camiseta real e diga no final qual escolheu.
```
