<div align="center">

# Florá

**a arte de florescer**

Landing page de uma marca de camisetas com propósito: cada coleção apoia uma causa, e **70% do lucro líquido** vai para uma ONG.

[Ver o site](https://lucasdbf.github.io/Site-Flora/) · [A causa](#a-causa) · [Como rodar](#como-rodar)

</div>

---

## O que é

A Florá é uma marca fictícia criada para um projeto de empreendedorismo do Colégio Dehon. A ideia é lançar uma coleção nova a cada dois meses, sempre ligada a uma causa e a uma ONG que a apoia.

Este repositório é o site da **Coleção 1**: uma única camiseta branca com um laço dourado e um coração vermelho bordados no peito esquerdo.

O site funciona como uma vitrine. Não tem carrinho nem pagamento: o visitante vê a camiseta em 3D e fala com a marca pelo WhatsApp, onde combina tamanho, preço e entrega.

## A causa

A Coleção 1 apoia o **GRAACC** (Grupo de Apoio ao Adolescente e à Criança com Câncer), que cuida de crianças e adolescentes com câncer desde 1991. O laço dourado é o símbolo da luta contra o câncer infantil.

## O que o site tem

- **Camiseta em 3D interativa.** O visitante arrasta para girar e vê frente, bordado de perto e costas.
- **Capítulos guiados pelo scroll.** A câmera acompanha a rolagem e vai passando pelas partes da camiseta.
- **Compra por contato.** Os botões abrem o WhatsApp com uma mensagem já preenchida.
- **Responsivo.** Pensado para o celular primeiro.
- **Identidade visual a partir do logo.** As cores vêm das cinco pétalas em forma de coração.

## Como foi feito

| Parte | Tecnologia |
| --- | --- |
| Página | HTML, CSS e JavaScript puros, sem build |
| 3D no navegador | [three.js](https://threejs.org/) (incluído em `vendor/`) |
| Modelo da camiseta | Feito no Blender e exportado em `.glb` |
| Hospedagem | GitHub Pages |

O modelo 3D tem cerca de 55 mil triângulos e 3 MB, com tecido de malha, costuras, gola canelada e o bordado como textura.

## Estrutura

```
index.html          a página
css/style.css       estilos
js/main.js          visualizador 3D e interações
assets/models/      camiseta.glb
assets/img/         imagens, favicon e pétalas
assets/fonts/       fontes
vendor/three/       three.js
PRODUCT.md          contexto do produto
```

## Como rodar

O site é estático, mas o modelo 3D é carregado por módulos JavaScript. Por isso ele precisa de um servidor local, e abrir o `index.html` com duplo clique não funciona.

```bash
python3 -m http.server 8765
```

Depois abra http://localhost:8765.

## Antes de usar de verdade

- O número do WhatsApp nos botões (`5500000000000`) é fictício. Troque nos três links do `index.html`.
- A marca, a empresa e a doação são parte de um trabalho escolar: não há CNPJ nem comprovante de repasse.

## Autoria

Projeto de empreendedorismo da turma 1e do Colégio Dehon, por Maria Cristina, Maria Laura e Laura.
