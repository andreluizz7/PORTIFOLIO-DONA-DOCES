const dom = {
  carrinhoModal: document.querySelector('.carrinho-modal'),
  abrirCarrinhoBtn: document.querySelector('#abrir-carrinho-btn'),
  fecharCarrinhoBtn: document.querySelector('#fechar-carrinho-btn'),
  adicionarAoCarrinhoBtns: document.querySelectorAll('.main__produtos__item__botao'),
  finalizarCompraBtn: document.querySelector('#finalizar-compra-btn'),
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
const CART_STORAGE_KEY = 'carrinho';
const MESSAGES = {
  carrinhoVazio: 'Seu carrinho esta vazio.',
  itemAdicionado: (titulo) => `${titulo} foi adicionado ao carrinho!`,
};

let lastFocusedElement = null;

const openModal = (modal) => {
  modal.classList.add('aberto');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-aberto');
};

const closeModal = (modal) => {
  modal.classList.remove('aberto');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-aberto');
};

const parsePreco = (preco) => {
  const normalized = preco.replace(PRICE_LABEL, '').replace(/\s/g, '').replace(',', '.');
  const value = Number.parseFloat(normalized);
  return Number.isNaN(value) ? 0 : value;
};

const formatPreco = (valor) => {
  return `${PRICE_LABEL} ${valor.toFixed(2).replace('.', ',')}`;
};

const atualizarTotal = (valor) => {
  state.total += valor;
  dom.totalValor.textContent = formatPreco(state.total);
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

const obterCarrinho = () => {
  const itens = [...dom.carrinhoItensContainer.querySelectorAll('.carrinho-modal__item')].map(
    (item) => {
      const img = item.querySelector('.carrinho-modal__item__img');
      const titulo = item.querySelector('.carrinho-modal__item__titulo');
      const precoTexto = item.querySelector('.carrinho-modal__item__preco');
      const quantidadeSpan = item.querySelector('.carrinho-modal__item__quantidade-valor');

      const precoUnitario = parsePreco(precoTexto.textContent);
      const quantidade = Number.parseInt(quantidadeSpan.textContent, 10);

      return {
        imgSrc: img.src,
        titulo: titulo.textContent,
        precoUnitario,
        quantidade,
      };
    },
  );

  return {
    itens,
    total: state.total,
  };
};

dom.abrirCarrinhoBtn.addEventListener('click', () => {
  lastFocusedElement = document.activeElement;
  openModal(dom.carrinhoModal);
  setTimeout(() => {
    dom.fecharCarrinhoBtn.focus();
  }, 0);
});

dom.fecharCarrinhoBtn.addEventListener('click', () => {
  closeModal(dom.carrinhoModal);
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
});

dom.finalizarCompraBtn.addEventListener('click', () => {
  const carrinho = obterCarrinho();

  if (carrinho.itens.length === 0) {
    mostrarAviso(MESSAGES.carrinhoVazio);
    return;
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrinho));
  window.location.href = 'pedidos.html';
});

dom.adicionarAoCarrinhoBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.main__produtos__item');
    const img = item.querySelector('.main__produtos__item__img');
    const titulo = item.querySelector('.main__produtos__item__titulo');
    const preco = item.querySelector('.main__produtos__item__preco');

    adicionarItemAoCarrinho(img.src, titulo.textContent, preco.textContent);
    mostrarAviso(MESSAGES.itemAdicionado(titulo.textContent));
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  if (dom.carrinhoModal.classList.contains('aberto')) {
    closeModal(dom.carrinhoModal);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }
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