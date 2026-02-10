const dom = {
  carrinhoModal: document.querySelector('.carrinho-modal'),
  abrirCarrinhoBtn: document.querySelector('#abrir-carrinho-btn'),
  fecharCarrinhoBtn: document.querySelector('#fechar-carrinho-btn'),
  adicionarAoCarrinhoBtns: document.querySelectorAll('.main__produtos__item__botao'),
  finalizarCompraBtn: document.querySelector('#finalizar-compra-btn'),
  loginModal: document.querySelector('.login-modal'),
  fecharLoginBtn: document.querySelector('#fechar-login-btn'),
  carrinhoItensContainer: document.querySelector('.carrinho-modal__itens'),
  totalValor: document.querySelector('.carrinho-modal__total-valor'),
  toastContainer: document.getElementById('toast-container'),
};

const state = {
  total: 0,
};

const PRICE_LABEL = 'R$';
const TOAST_SHOW_DELAY_MS = 100;
const TOAST_HIDE_DELAY_MS = 3000;
const TOAST_REMOVE_DELAY_MS = 300;

const openModal = (modal) => {
  modal.classList.add('aberto');
};

const closeModal = (modal) => {
  modal.classList.remove('aberto');
};

const showLoginModal = () => {
  dom.loginModal.classList.remove('hidden');
  openModal(dom.loginModal);
};

const hideLoginModal = () => {
  closeModal(dom.loginModal);
  dom.loginModal.classList.add('hidden');
};

const parsePreco = (preco) => {
  const normalized = preco.replace(PRICE_LABEL, '').replace(',', '.');
  const value = Number.parseFloat(normalized);
  return Number.isNaN(value) ? 0 : value;
};

const atualizarTotal = (valor) => {
  state.total += valor;
  dom.totalValor.textContent = `${PRICE_LABEL} ${state.total.toFixed(2)}`;
};

const criarItemHTML = (imgSrc, titulo, preco) => `
  <div class="carrinho-modal__item">
    <img src="${imgSrc}" alt="${titulo}" class="carrinho-modal__item__img" />
    <div class="carrinho-modal__item__detalhes">
      <h4 class="carrinho-modal__item__titulo">${titulo}</h4>
      <p class="carrinho-modal__item__preco">${preco}</p>
      <div class="carrinho-modal__item__quantidade">
        <button class="carrinho-modal__item__btn remover">Remover</button>
        <span class="carrinho-modal__item__quantidade-valor">1</span>
        <button class="carrinho-modal__item__btn adicionar">Adicionar</button>
      </div>
    </div>
  </div>
`;

const obterItemExistente = (titulo) => {
  const itens = dom.carrinhoItensContainer.querySelectorAll('.carrinho-modal__item');
  return [...itens].find(
    (item) => item.querySelector('.carrinho-modal__item__titulo').textContent === titulo,
  );
};

const atualizarQuantidade = (item, delta) => {
  const quantidadeSpan = item.querySelector('.carrinho-modal__item__quantidade-valor');
  const quantidadeAtual = Number.parseInt(quantidadeSpan.textContent, 10);
  const novaQuantidade = quantidadeAtual + delta;

  if (novaQuantidade <= 0) {
    item.remove();
    return 0;
  }

  quantidadeSpan.textContent = novaQuantidade;
  return novaQuantidade;
};

const adicionarItemAoCarrinho = (imgSrc, titulo, preco) => {
  const precoNumber = parsePreco(preco);
  const itemExistente = obterItemExistente(titulo);

  if (itemExistente) {
    atualizarQuantidade(itemExistente, 1);
    atualizarTotal(precoNumber);
    return;
  }

  dom.carrinhoItensContainer.insertAdjacentHTML(
    'beforeend',
    criarItemHTML(imgSrc, titulo, preco),
  );
  atualizarTotal(precoNumber);
};

const mostrarAviso = (mensagem) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;

  dom.toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), TOAST_SHOW_DELAY_MS);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), TOAST_REMOVE_DELAY_MS);
  }, TOAST_HIDE_DELAY_MS);
};

dom.abrirCarrinhoBtn.addEventListener('click', () => {
  openModal(dom.carrinhoModal);
});

dom.fecharCarrinhoBtn.addEventListener('click', () => {
  closeModal(dom.carrinhoModal);
});

dom.finalizarCompraBtn.addEventListener('click', () => {
  closeModal(dom.carrinhoModal);
  showLoginModal();
});

dom.fecharLoginBtn.addEventListener('click', () => {
  hideLoginModal();
});

dom.adicionarAoCarrinhoBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.main__produtos__item');
    const img = item.querySelector('.main__produtos__item__img');
    const titulo = item.querySelector('.main__produtos__item__titulo');
    const preco = item.querySelector('.main__produtos__item__preco');

    adicionarItemAoCarrinho(img.src, titulo.textContent, preco.textContent);
    mostrarAviso(`${titulo.textContent} foi adicionado ao carrinho!`);
  });
});

dom.carrinhoItensContainer.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.classList.contains('carrinho-modal__item__btn')) {
    return;
  }

  const item = target.closest('.carrinho-modal__item');
  const precoTexto = item.querySelector('.carrinho-modal__item__preco').textContent;
  const precoNumber = parsePreco(precoTexto);

  if (target.classList.contains('adicionar')) {
    atualizarQuantidade(item, 1);
    atualizarTotal(precoNumber);
    return;
  }

  if (target.classList.contains('remover')) {
    const quantidade = atualizarQuantidade(item, -1);
    if (quantidade === 0) {
      atualizarTotal(-precoNumber);
      return;
    }
    atualizarTotal(-precoNumber);
  }
});