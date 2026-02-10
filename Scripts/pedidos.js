const CART_STORAGE_KEY = 'carrinho';
const PRICE_LABEL = 'R$';
const MESSAGES = {
  carrinhoVazio: 'Seu carrinho esta vazio.',
};

const dom = {
  lista: document.querySelector('.pedidos__lista'),
  total: document.querySelector('.pedidos__total-valor'),
  vazio: document.querySelector('.pedidos__vazio'),
};

const formatarPreco = (valor) => {
  return `${PRICE_LABEL} ${valor.toFixed(2).replace('.', ',')}`;
};

const carregarCarrinho = () => {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return { itens: [], total: 0 };
  }

  try {
    const data = JSON.parse(raw);
    return {
      itens: Array.isArray(data.itens) ? data.itens : [],
      total: typeof data.total === 'number' ? data.total : 0,
    };
  } catch (error) {
    return { itens: [], total: 0 };
  }
};

const renderizarItens = (itens) => {
  dom.lista.innerHTML = '';

  itens.forEach((item) => {
    const totalItem = item.precoUnitario * item.quantidade;

    const card = document.createElement('article');
    card.className = 'pedidos__item';
    card.innerHTML = `
      <img src="${item.imgSrc}" alt="${item.titulo}" class="pedidos__item__img" />
      <div class="pedidos__item__info">
        <h3 class="pedidos__item__titulo">${item.titulo}</h3>
        <p class="pedidos__item__quantidade">Quantidade: ${item.quantidade}</p>
        <p class="pedidos__item__total">Total do item: ${formatarPreco(totalItem)}</p>
      </div>
    `;

    dom.lista.appendChild(card);
  });
};

const renderizarResumo = (itens, total) => {
  const totalCalculado = itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0,
  );
  const totalFinal = total > 0 ? total : totalCalculado;

  dom.total.textContent = formatarPreco(totalFinal);
};

const iniciar = () => {
  const carrinho = carregarCarrinho();

  if (carrinho.itens.length === 0) {
    dom.vazio.textContent = MESSAGES.carrinhoVazio;
    dom.vazio.style.display = 'block';
    dom.total.textContent = formatarPreco(0);
    return;
  }

  dom.vazio.style.display = 'none';
  renderizarItens(carrinho.itens);
  renderizarResumo(carrinho.itens, carrinho.total);
};

iniciar();
