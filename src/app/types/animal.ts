// Corresponde ao AnimalResponseDTO do backend
export interface Animal {
    id: number;
    identificador: string;
    sexo: 'Macho' | 'Fêmea';
    raca: string;
    dataNascimento: string; // A data virá como string no JSON
    status: string;
}

// Corresponde ao AnimalRequestDTO do backend
export interface AnimalRequestDTO {
    identificador: string;
    raca: string;
    sexo: 'Macho' | 'Fêmea';
    dataNascimento: string; // Formato YYYY-MM-DD
}

// Para a página de detalhes que faremos no futuro
// (É bom já deixar definido)
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