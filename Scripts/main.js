const carrinhoModal = document.querySelector('.carrinho-modal');
const abrirCarrinhoBtn = document.querySelector('#abrir-carrinho-btn');
const fecharCarrinhoBtn = document.querySelector('#fechar-carrinho-btn');
const adicionarAoCarrinhoBtns = document.querySelectorAll('.main__produtos__item__botao');
const finalizarCompraBtn = document.querySelector('#finalizar-compra-btn');
const loginModal = document.querySelector('.login-modal');
const fecharLoginBtn = document.querySelector('#fechar-login-btn');


abrirCarrinhoBtn.addEventListener('click', () => {
  carrinhoModal.classList.add('aberto');
});

fecharCarrinhoBtn.addEventListener('click', () => {
  carrinhoModal.classList.remove('aberto');
});

finalizarCompraBtn.addEventListener('click', () => {
  carrinhoModal.classList.remove('aberto');
  loginModal.classList.remove('hidden');
  loginModal.classList.add('aberto');
});

fecharLoginBtn.addEventListener('click', () => {
  loginModal.classList.remove('aberto');
  loginModal.classList.add('hidden');
});

let total = 0;
const carrinhoItensContainer = document.querySelector('.carrinho-modal__itens');
const totalValor = document.querySelector('.carrinho-modal__total-valor');

function atualizarTotal(valor) {
  total += valor;
  totalValor.textContent = `R$ ${total.toFixed(2)}`;
}

function criarItemHTML(imgSrc, titulo, preco) {
  return `
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
}

function adicionarItemAoCarrinho(imgSrc, titulo, preco) {
  const precoNumber = parseFloat(preco.replace('R$', '').replace(',', '.'));

  const itemExistente = [...carrinhoItensContainer.querySelectorAll('.carrinho-modal__item')]
    .find(item => item.querySelector('.carrinho-modal__item__titulo').textContent === titulo);

  if (itemExistente) {
    const quantidadeSpan = itemExistente.querySelector('.carrinho-modal__item__quantidade-valor');
    let quantidadeAtual = parseInt(quantidadeSpan.textContent);
    quantidadeSpan.textContent = quantidadeAtual + 1;
    atualizarTotal(precoNumber);
  } else {
    const itemHTML = criarItemHTML(imgSrc, titulo, preco);
    carrinhoItensContainer.insertAdjacentHTML('beforeend', itemHTML);
    atualizarTotal(precoNumber);

    // Adiciona lógica aos botões dentro do item recém-criado
    const novoItem = carrinhoItensContainer.lastElementChild;
    const btnAdicionar = novoItem.querySelector('.adicionar');
    const btnRemover = novoItem.querySelector('.remover');

    btnAdicionar.addEventListener('click', () => {
      const quantidadeSpan = novoItem.querySelector('.carrinho-modal__item__quantidade-valor');
      let quantidadeAtual = parseInt(quantidadeSpan.textContent);
      quantidadeSpan.textContent = quantidadeAtual + 1;
      atualizarTotal(precoNumber);
    });

    btnRemover.addEventListener('click', () => {
      const quantidadeSpan = novoItem.querySelector('.carrinho-modal__item__quantidade-valor');
      let quantidadeAtual = parseInt(quantidadeSpan.textContent);

      if (quantidadeAtual > 1) {
        quantidadeSpan.textContent = quantidadeAtual - 1;
        atualizarTotal(-precoNumber);
      } else {
        // Remove item se quantidade chegar a zero
        novoItem.remove();
        atualizarTotal(-precoNumber);
      }
    });
  }
}

adicionarAoCarrinhoBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.main__produtos__item');
    const img = item.querySelector('.main__produtos__item__img');
    const titulo = item.querySelector('.main__produtos__item__titulo');
    const preco = item.querySelector('.main__produtos__item__preco');
    adicionarItemAoCarrinho(img.src, titulo.textContent, preco.textContent);
    // Aviso visual
    mostrarAviso(`${titulo.textContent} foi adicionado ao carrinho!`);
  });
});

function mostrarAviso(mensagem) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;

  container.appendChild(toast);

  // Força animação
  setTimeout(() => toast.classList.add('show'), 100);

  // Remove após 3 segundos
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}