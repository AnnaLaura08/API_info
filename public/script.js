// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let produtoEmEdicao = null;

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function mostrarMensagem(mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMessage');
    const modalText = document.getElementById('modalText');
    
    modalText.textContent = mensagem;
    modal.style.display = 'flex';
    
    if (tipo === 'sucesso') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    } else if (tipo === 'erro') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }
}

function fecharModal() {
    document.getElementById('modalMessage').style.display = 'none';
}

function limparFormulario() {
    document.getElementById('productForm').reset();
    produtoEmEdicao = null;
    document.querySelector('.form-section h2').textContent = 'Adicionar ou Editar Produto';
}

function formatarPreco(valor) {
    if (!valor) return 'R$ 0,00';
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
}

// ========================================
// OPERAÇÕES COM A API
// ========================================

async function carregarProdutos() {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const productsList = document.getElementById('productsList');
    
    loadingMessage.style.display = 'block';
    productsList.innerHTML = '';
    
    try {
        const resposta = await fetch('/produtos');
        
        if (!resposta.ok) throw new Error('Erro ao buscar produtos');
        
        const produtos = await resposta.json();
        loadingMessage.style.display = 'none';
        
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
            productsList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao carregar os produtos. Tente novamente.', 'erro');
    }
}

async function criarProduto(dados) {
    try {
        const resposta = await fetch('/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao criar produto');
        }
        
        mostrarMensagem('Produto cadastrado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

async function atualizarProduto(id, dados) {
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao atualizar produto');
        }
        
        mostrarMensagem('Produto atualizado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'DELETE'
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao deletar produto');
        }
        
        mostrarMensagem('Produto removido com sucesso!', 'sucesso');
        carregarProdutos();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// ========================================
// EXIBIÇÃO DE DADOS
// ========================================

function exibirTabela(produtos) {
    const productsList = document.getElementById('productsList');
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Categoria</th>
                    <th>Modelo</th>
                    <th>Fabricante</th>
                    <th>Estoque</th>
                    <th>Local</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    produtos.forEach(produto => {
        // Os nomes das propriedades podem vir em minúsculo do PostgreSQL dependendo de como as aspas foram aplicadas
        const id = produto.idprod || produto.idProd;
        const nome = produto.nomeprod || produto.nomeProd;
        const preco = produto.preco;
        const cat = produto.catprod || produto.catProd;
        const modelo = produto.modelo;
        const fabricante = produto.fabricante;
        const estoque = produto.estoque;
        const locall = produto.locall;

        html += `
            <tr>
                <td>#${id}</td>
                <td>${nome}</td>
                <td>${formatarPreco(preco)}</td>
                <td>${cat}</td>
                <td>${modelo}</td>
                <td>${fabricante}</td>
                <td>${estoque}</td>
                <td>${locall}</td>
                <td class="acoes">
                    <button class="btn btn-edit" onclick="editarProduto(${id}, '${nome}', ${preco}, '${cat}', '${modelo}', '${fabricante}', ${estoque}, '${locall}')">✏️</button>
                    <button class="btn btn-danger" onclick="deletarProduto(${id})">🗑️</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    productsList.innerHTML = html;
}

function editarProduto(id, nomeProd, preco, catProd, modelo, fabricante, estoque, locall) {
    produtoEmEdicao = id;
    
    document.getElementById('nomeProd').value = nomeProd;
    document.getElementById('preco').value = preco;
    document.getElementById('catProd').value = catProd;
    document.getElementById('modelo').value = modelo;
    document.getElementById('fabricante').value = fabricante;
    document.getElementById('estoque').value = estoque;
    document.getElementById('locall').value = locall;
    
    document.querySelector('.form-section h2').textContent = `Editando Produto #${id}`;
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// BUSCA E FILTRO
// ========================================

async function buscarProdutos(tipo, valor) {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const productsList = document.getElementById('productsList');
    
    loadingMessage.style.display = 'block';
    productsList.innerHTML = '';
    
    try {
        const resposta = await fetch(`/produtos/buscar?tipo=${tipo}&valor=${encodeURIComponent(valor)}`);
        
        if (!resposta.ok) throw new Error('Erro ao buscar produtos');
        
        const produtos = await resposta.json();
        loadingMessage.style.display = 'none';
        
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
            productsList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao buscar os produtos. Tente novamente.', 'erro');
    }
}

function filtrarProdutos() {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const valor = searchInput.value.trim();
    
    if (valor === '') {
        carregarProdutos();
    } else {
        buscarProdutos(searchType.value, valor);
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
    
    document.getElementById('productForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nomeProd = document.getElementById('nomeProd').value.trim();
        const preco = document.getElementById('preco').value.trim();
        const catProd = document.getElementById('catProd').value.trim();
        const modelo = document.getElementById('modelo').value.trim();
        const fabricante = document.getElementById('fabricante').value.trim();
        const estoque = document.getElementById('estoque').value.trim();
        const locall = document.getElementById('locall').value.trim();
        
        if (!nomeProd || !preco || !catProd || !modelo || !fabricante || !estoque || !locall) {
            mostrarMensagem('Por favor, preencha todos os campos!', 'erro');
            return;
        }
        
        const dados = { nomeProd, preco, catProd, modelo, fabricante, estoque, locall };
        
        if (produtoEmEdicao) {
            atualizarProduto(produtoEmEdicao, dados);
        } else {
            criarProduto(dados);
        }
    });
    
    document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
    document.getElementById('btnRecarregar').addEventListener('click', carregarProdutos);
    document.getElementById('btnBuscar').addEventListener('click', filtrarProdutos);
    
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filtrarProdutos();
        }
    });
    
    document.getElementById('modalMessage').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModal();
        }
    });
});