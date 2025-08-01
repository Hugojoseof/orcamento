/**
 * Gerenciador de Itens
 * Gerencia a adição, remoção e manipulação de itens do orçamento
 */

import { Formatters } from '../utils/formatters.js';

export class ItemManager {
    constructor(orcamentoGenerator) {
        this.orcamentoGenerator = orcamentoGenerator;
        this.itemCounter = 1;
    }

    /**
     * Adiciona item inicial
     */
    addInitialItem() {
        this.addItem();
    }

    /**
     * Adiciona novo item
     */
    addItem() {
        const itemsList = document.getElementById('itemsList');
        if (!itemsList) {
            console.error('❌ Lista de itens não encontrada');
            return;
        }

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-row';
        itemDiv.innerHTML = `
            <span class="item-number">${this.itemCounter}</span>
            <input type="number" class="item-quantidade" value="1" min="1" oninput="window.App.orcamentoGenerator.calculateTotals()">
            <div class="medidas-container">
                <input type="number" class="item-altura" placeholder="Altura" step="0.01" oninput="window.App.orcamentoGenerator.calculateTotals()">
                <span>x</span>
                <input type="number" class="item-largura" placeholder="Largura" step="0.01" oninput="window.App.orcamentoGenerator.calculateTotals()">
                <span style="font-size: 0.75rem; color: #9ca3af;">m</span>
            </div>
            <input type="text" class="item-descricao" placeholder="Descrição do produto/serviço" oninput="window.App.orcamentoGenerator.calculateTotals()">
            <input type="number" class="item-valor" value="0" min="0" step="0.01" oninput="window.App.orcamentoGenerator.calculateTotals()">
            <span class="item-total">R$ 0,00</span>
            <button type="button" class="remove-item" onclick="window.App.orcamentoGenerator.itemManager.removeItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;

        itemsList.appendChild(itemDiv);
        this.itemCounter++;
        this.orcamentoGenerator.calculateTotals();
    }

    /**
     * Remove item
     */
    removeItem(button) {
        const itemRow = button.closest('.item-row');
        if (itemRow) {
            itemRow.remove();
            this.reorderItems();
            this.orcamentoGenerator.calculateTotals();
        }
    }

    /**
     * Reordena itens
     */
    reorderItems() {
        const items = document.querySelectorAll('.item-row');
        items.forEach((item, index) => {
            const numberSpan = item.querySelector('.item-number');
            if (numberSpan) {
                numberSpan.textContent = index + 1;
            }
        });
        this.itemCounter = items.length + 1;
    }

    /**
     * Limpa todos os itens
     */
    clearItems() {
        const itemsList = document.getElementById('itemsList');
        if (itemsList) {
            itemsList.innerHTML = '';
            this.itemCounter = 1;
        }
    }

    /**
     * Obtém dados dos itens
     */
    getItemsData() {
        const items = [];
        document.querySelectorAll('.item-row').forEach(item => {
            const altura = parseFloat(item.querySelector('.item-altura').value) || 0;
            const largura = parseFloat(item.querySelector('.item-largura').value) || 0;
            
            items.push({
                numero: item.querySelector('.item-number').textContent,
                quantidade: parseFloat(item.querySelector('.item-quantidade').value) || 0,
                altura: altura,
                largura: largura,
                descricao: item.querySelector('.item-descricao').value,
                valor: parseFloat(item.querySelector('.item-valor').value) || 0,
                total: this.parseCurrencyValue(item.querySelector('.item-total').textContent)
            });
        });
        return items;
    }

    /**
     * Converte valor monetário para número
     */
    parseCurrencyValue(value) {
        if (!value) return 0;
        const cleanValue = value.replace('R$', '').replace('.', '').replace(',', '.');
        return parseFloat(cleanValue) || 0;
    }

    /**
     * Valida se há itens
     */
    hasItems() {
        const items = document.querySelectorAll('.item-row');
        return items.length > 0;
    }

    /**
     * Obtém total de itens
     */
    getItemsCount() {
        return document.querySelectorAll('.item-row').length;
    }

    /**
     * Obtém item por índice
     */
    getItemByIndex(index) {
        const items = document.querySelectorAll('.item-row');
        return items[index] || null;
    }

    /**
     * Atualiza item
     */
    updateItem(index, data) {
        const item = this.getItemByIndex(index);
        if (!item) return false;

        try {
            if (data.quantidade !== undefined) {
                item.querySelector('.item-quantidade').value = data.quantidade;
            }
            if (data.altura !== undefined) {
                item.querySelector('.item-altura').value = data.altura;
            }
            if (data.largura !== undefined) {
                item.querySelector('.item-largura').value = data.largura;
            }
            if (data.descricao !== undefined) {
                item.querySelector('.item-descricao').value = data.descricao;
            }
            if (data.valor !== undefined) {
                item.querySelector('.item-valor').value = data.valor;
            }

            this.orcamentoGenerator.calculateTotals();
            return true;
        } catch (error) {
            console.error('❌ Erro ao atualizar item:', error);
            return false;
        }
    }

    /**
     * Duplica item
     */
    duplicateItem(index) {
        const item = this.getItemByIndex(index);
        if (!item) return false;

        try {
            const data = {
                quantidade: parseFloat(item.querySelector('.item-quantidade').value) || 1,
                altura: parseFloat(item.querySelector('.item-altura').value) || 0,
                largura: parseFloat(item.querySelector('.item-largura').value) || 0,
                descricao: item.querySelector('.item-descricao').value,
                valor: parseFloat(item.querySelector('.item-valor').value) || 0
            };

            this.addItem();
            const newIndex = this.getItemsCount() - 1;
            this.updateItem(newIndex, data);

            return true;
        } catch (error) {
            console.error('❌ Erro ao duplicar item:', error);
            return false;
        }
    }

    /**
     * Move item para cima
     */
    moveItemUp(index) {
        if (index <= 0) return false;

        const itemsList = document.getElementById('itemsList');
        const items = itemsList.children;
        
        if (index < items.length) {
            itemsList.insertBefore(items[index], items[index - 1]);
            this.reorderItems();
            this.orcamentoGenerator.calculateTotals();
            return true;
        }

        return false;
    }

    /**
     * Move item para baixo
     */
    moveItemDown(index) {
        const itemsList = document.getElementById('itemsList');
        const items = itemsList.children;
        
        if (index < items.length - 1) {
            itemsList.insertBefore(items[index + 1], items[index]);
            this.reorderItems();
            this.orcamentoGenerator.calculateTotals();
            return true;
        }

        return false;
    }

    /**
     * Obtém estatísticas dos itens
     */
    getItemsStats() {
        const items = this.getItemsData();
        
        return {
            total: items.length,
            totalValue: items.reduce((sum, item) => sum + item.total, 0),
            totalQuantity: items.reduce((sum, item) => sum + item.quantidade, 0),
            averageValue: items.length > 0 ? items.reduce((sum, item) => sum + item.total, 0) / items.length : 0,
            hasItems: items.length > 0
        };
    }
} 