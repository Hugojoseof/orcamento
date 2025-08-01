/**
 * Utilitários de Formatação
 * Funções para formatação de dados da aplicação
 */

export class Formatters {
    /**
     * Formata valor monetário
     * @param {number} value - Valor para formatar
     * @returns {string} Valor formatado
     */
    static formatCurrency(value) {
        if (value === null || value === undefined || isNaN(value)) {
            return 'R$ 0,00';
        }
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    /**
     * Formata medidas (altura x largura)
     * @param {number} altura - Altura em m
     * @param {number} largura - Largura em m
     * @returns {string} Medidas formatadas
     */
    static formatMedidas(altura, largura) {
        if (!altura && !largura) {
            return '-';
        }
        
        const alturaStr = altura ? altura.toString() : '0';
        const larguraStr = largura ? largura.toString() : '0';
        
        return `${alturaStr} x ${larguraStr} m`;
    }

    /**
     * Formata data para exibição
     * @param {string|Date} date - Data para formatar
     * @returns {string} Data formatada
     */
    static formatDate(date) {
        if (!date) return '-';
        
        try {
            const dateObj = new Date(date);
            return dateObj.toLocaleDateString('pt-BR');
        } catch (error) {
            return date.toString();
        }
    }

    /**
     * Formata data e hora
     * @param {string|Date} date - Data para formatar
     * @returns {string} Data e hora formatada
     */
    static formatDateTime(date) {
        if (!date) return '-';
        
        try {
            const dateObj = new Date(date);
            return dateObj.toLocaleString('pt-BR');
        } catch (error) {
            return date.toString();
        }
    }

    /**
     * Formata CPF/CNPJ
     * @param {string} value - CPF ou CNPJ
     * @returns {string} CPF/CNPJ formatado
     */
    static formatCPFCNPJ(value) {
        if (!value) return '-';
        
        // Remove caracteres não numéricos
        const numbers = value.replace(/\D/g, '');
        
        if (numbers.length === 11) {
            // Formata CPF
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numbers.length === 14) {
            // Formata CNPJ
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        
        return value;
    }

    /**
     * Formata telefone
     * @param {string} value - Telefone
     * @returns {string} Telefone formatado
     */
    static formatPhone(value) {
        if (!value) return '-';
        
        // Remove caracteres não numéricos
        const numbers = value.replace(/\D/g, '');
        
        if (numbers.length === 11) {
            // Celular com DDD
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (numbers.length === 10) {
            // Telefone fixo com DDD
            return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (numbers.length === 8) {
            // Telefone local
            return numbers.replace(/(\d{4})(\d{4})/, '$1-$2');
        }
        
        return value;
    }

    /**
     * Formata número do orçamento
     * @param {number|string} number - Número do orçamento
     * @returns {string} Número formatado
     */
    static formatOrcamentoNumber(number) {
        if (!number) return '0000';
        
        return number.toString().padStart(4, '0');
    }

    /**
     * Formata texto para título
     * @param {string} text - Texto para formatar
     * @returns {string} Texto formatado
     */
    static formatTitle(text) {
        if (!text) return '';
        
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Trunca texto com reticências
     * @param {string} text - Texto para truncar
     * @param {number} maxLength - Comprimento máximo
     * @returns {string} Texto truncado
     */
    static truncateText(text, maxLength = 50) {
        if (!text) return '';
        
        if (text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Formata bytes para formato legível
     * @param {number} bytes - Bytes para formatar
     * @returns {string} String formatada
     */
    static formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Formata tempo relativo
     * @param {string|Date} date - Data para calcular
     * @returns {string} Tempo relativo
     */
    static formatRelativeTime(date) {
        if (!date) return '-';
        
        try {
            const now = new Date();
            const targetDate = new Date(date);
            const diffInSeconds = Math.floor((now - targetDate) / 1000);
            
            if (diffInSeconds < 60) {
                return 'agora mesmo';
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
            } else if (diffInSeconds < 2592000) {
                const days = Math.floor(diffInSeconds / 86400);
                return `${days} dia${days > 1 ? 's' : ''} atrás`;
            } else {
                return this.formatDate(date);
            }
        } catch (error) {
            return date.toString();
        }
    }
} 