# 🍬 Dona Doces

Este projeto é um **MVP (Minimum Viable Product)** para demonstrar, de forma simples, como será a versão real do sistema de pedidos da Dona Doces.

O foco aqui é validar a experiência principal de navegação e compra:
**catálogo de produtos → carrinho → resumo de pedidos**.

---

## 🎯 Objetivo do MVP

- Apresentar visualmente os produtos artesanais
- Simular a adição/remover itens no carrinho
- Exibir um resumo final na página de pedidos
- Servir como base para evolução da versão completa

---

## ▶️ Como executar

### Versão online
👉 [Dona Doces no Vercel](https://dona-doces.vercel.app)

### Rodando localmente
1. Clone o repositório
2. Abra a pasta no VS Code
3. Execute com uma extensão como **Live Server** (ou abra o `index.html` no navegador)

---

## ✅ Funcionalidades atuais (MVP)

- Página inicial com vitrine de produtos
- Layout responsivo (mobile, tablet e desktop)
- Carrinho em modal lateral com:
  - abertura/fechamento
  - adição de itens
  - controle de quantidade (adicionar/remover)
  - cálculo do total
- Toasts de feedback ao adicionar item e ao tentar finalizar carrinho vazio
- Persistência temporária dos dados do carrinho via `localStorage`
- Página `pedidos.html` com:
  - listagem dos itens finalizados
  - quantidade por item
  - total por item
  - total geral do pedido

---

## ⚠️ Limitações deste MVP

- Não há autenticação de usuários
- Não há integração com banco de dados
- Não há pagamento online
- Não há painel administrativo
- Os dados são apenas locais no navegador (podem ser perdidos ao limpar armazenamento)

---

## 🛠️ Tecnologias utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Vercel** (deploy)

---

## 📁 Estrutura do projeto

```
PORTIFOLIO-DONA-DOCES/
├── index.html
├── pedidos.html
├── Styles/
│   └── Styles.css
├── Scripts/
│   ├── main.js
│   └── pedidos.js
├── Assets/
└── README.md
```

---

## 🙋‍♂️ Autor

**😀 André Luiz Blazius**  
📧 al2981085@gmail.com  
📍 Ibirama, SC – Brasil
