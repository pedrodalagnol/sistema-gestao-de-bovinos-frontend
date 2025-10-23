// DTO aninhado para as informações do lote, espelhando o backend
interface LoteInfo {
    id: number;
    nome: string;
}

// Corresponde ao AnimalResponseDTO do backend
export interface Animal {
    id: number;
    identificador: string;
    sexo: 'Macho' | 'Fêmea';
    raca: string;
    dataNascimento: string;
    status: string;
    lote: LoteInfo | null; // <-- ADICIONE ESTA LINHA
}

// Corresponde ao AnimalRequestDTO do backend
export interface AnimalRequestDTO {
    identificador: string;
    raca: string;
    sexo: 'Macho' | 'Fêmea';
    dataNascimento: string;
}

// Para a página de detalhes que faremos no futuro
export interface AnimalDetails extends Animal {
    gmd: number;
    historico: {
        id: number;
        tipoEvento: string;
        dataEvento: string;
        valor: number;
        observacoes: string;
    }[];
}