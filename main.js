let listaDeItens = [] // Array que vai armazenar os itens da lista de compras
let itemAEditar // Variável que armazena o índice do item que está sendo editado

const form = document.getElementById("form-itens") // Seleciona o formulário de adição de itens pelo ID
const itensInput = document.getElementById("receber-item") // Seleciona o campo de input de texto pelo ID
const ulItens = document.getElementById("lista-de-itens") // Seleciona a lista não ordenada de itens a serem comprados pelo ID
const ulItensComprados = document.getElementById("itens-comprados") // Seleciona a lista não ordenada de itens comprados pelo ID
const listaRecuperada = localStorage.getItem('listaDeItens') // Recupera a lista de itens do armazenamento local do navegador

// Função para atualizar o armazenamento local com a lista de itens atualizada
function atualizaLocalStorage() {
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens)) // Salva a lista no armazenamento local, convertendo-a para string JSON
}

// Verifica se há uma lista recuperada do armazenamento local
if (listaRecuperada) {
    listaDeItens = JSON.parse(listaRecuperada) // Converte a string JSON de volta para um array de objetos
    mostrarItem() // Exibe os itens na tela
} else {
    listaDeItens = [] // Se não houver lista no armazenamento local, inicializa um array vazio
}

// Adiciona um listener de evento para o envio do formulário
form.addEventListener("submit", function (evento) {
    evento.preventDefault() // Impede o comportamento padrão do formulário (recarregar a página)
    salvarItem() // Chama a função para salvar o item
    mostrarItem() // Chama a função para exibir os itens na tela
    itensInput.focus() // Foca o campo de input para adicionar mais itens
})

// Função para salvar um novo item na lista
function salvarItem() {
    const comprasItem = itensInput.value // Obtém o valor do campo de input
    const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase()) // Verifica se o item já existe na lista (ignorando maiúsculas/minúsculas)

    if (checarDuplicado) {
        alert("Item já existe") // Exibe um alerta se o item já existir
    } else {
        listaDeItens.push({ // Adiciona o novo item ao array
            valor: comprasItem, // Valor do item
            checar: false // Indica se o item foi comprado ou não
        })
    }

    itensInput.value = '' // Limpa o campo de input
}

// Função para exibir os itens na tela
function mostrarItem() {
    ulItens.innerHTML = '' // Limpa a lista de itens a serem comprados
    ulItensComprados.innerHTML = '' // Limpa a lista de itens comprados

    listaDeItens.forEach((elemento, index) => { // Percorre o array de itens
        if (elemento.checar) { // Se o item foi comprado
            ulItensComprados.innerHTML += `
                <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                    <div>
                        <input type="checkbox" checked class="is-clickable" />
                        <span class="itens-comprados is-size-5">${elemento.valor}</span>
                    </div>
                    <div>
                        <i class="fa-solid fa-trash is-clickable deletar"></i>
                    </div>
                </li>
            ` // Adiciona o item à lista de itens comprados
        } else { // Se o item não foi comprado
            ulItens.innerHTML += `
                <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                    <div>
                        <input type="checkbox" class="is-clickable" />
                        <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''}></input>
                    </div>

                    <div>
                        ${index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                        <i class="fa-solid fa-trash is-clickable deletar"></i>
                    </div>
                </li>
            ` // Adiciona o item à lista de itens a serem comprados
        }
    })

    const inputsCheck = document.querySelectorAll('input[type="checkbox"]') // Seleciona todos os checkboxes

    inputsCheck.forEach(i => { // Adiciona um listener de evento para cada checkbox
        i.addEventListener('click', (evento) => {
            valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value') // Obtém o índice do item clicado
            listaDeItens[valorDoElemento].checar = evento.target.checked // Atualiza o status do item (comprado/não comprado)
            mostrarItem() // Atualiza a exibição dos itens
        })
    })

    const deletarObjetos = document.querySelectorAll(".deletar") // Seleciona todos os ícones de exclusão

    deletarObjetos.forEach(i => { // Adiciona um listener de evento para cada ícone de exclusão
        i.addEventListener('click', (evento) => {
            valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value') // Obtém o índice do item a ser excluído
            listaDeItens.splice(valorDoElemento, 1) // Remove o item do array
            mostrarItem() // Atualiza a exibição dos itens
        })
    })

    const editarItens = document.querySelectorAll(".editar") // Seleciona todos os ícones de edição

    editarItens.forEach(i => { // Adiciona um listener de evento para cada ícone de edição
        i.addEventListener('click', (evento) => {
            itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value') // Obtém o índice do item a ser editado
            mostrarItem() // Atualiza a exibição dos itens
        })
    })

    atualizaLocalStorage() // Atualiza o armazenamento local com a lista de itens atualizada
}

// Função para salvar a edição de um item
function salvarEdicao() {
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`) // Seleciona o campo de input de texto do item que está sendo editado
    listaDeItens[itemAEditar].valor = itemEditado.value // Atualiza o valor do item no array
    itemAEditar = -1 // Reseta o índice do item que está sendo editado
    mostrarItem() // Atualiza a exibição dos itens
}