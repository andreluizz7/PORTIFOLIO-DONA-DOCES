const carrinhoModal = document.querySelector('.carrinho-modal');
const abrirCarrinhoBtn = document.querySelector('#abrir-carrinho-btn');
const fecharCarrinhoBtn = document.querySelector('#fechar-carrinho-btn');

abrirCarrinhoBtn.addEventListener('click', () => {
  carrinhoModal.classList.add('aberto');
});

fecharCarrinhoBtn.addEventListener('click', () => {
  carrinhoModal.classList.remove('aberto');
});

