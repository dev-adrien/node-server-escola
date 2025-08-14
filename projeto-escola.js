const PORT = 3000;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// variáveis de controle de id
let proximoIdAluno = 1;
let alunos = [];
let proximoIdProfessor = 1;
let professores = [];
let proximoIdTurma = 1;
let turmas = [];

app.get("/", (req, res) => {
    res.json({ mensagem: 'Servidor Node.js rodando com sucesso!' });
});

// alunos
// Cadastro de novo aluno
app.post("/alunos", (req, res) => {
    const {nome, idade} = req.body;
    if (!nome || !idade) {
        return res.status(400).json({ mensagem: "Nome e idade são obrigatórios!" });
    }

    const novoAluno = {
        id: proximoIdAluno++,
        nome: nome,
        idade: idade
    }
    
    alunos.push(novoAluno);
    res.status(201).json(novoAluno);
})

// Listagem dos alunos
app.get("/alunos", (req, res) => {
    res.status(200).json(alunos);
});

// Detalhes de um aluno
app.get("/alunos/:id", (req, res) => {
    const idAluno = parseInt(req.params.id)

    const aluno = alunos.find(a => a.id === idAluno)
    if (!aluno) {
        return res.status(404).json({ mensagem: "Aluno não encontrado!" })
    }
    res.status(200).json(aluno)
});

// Editar os dados de um aluno
app.put("/alunos/:id", (req, res) => {
    const idAluno = parseInt(req.params.id);
    const { nome, idade } = req.body;

    const indexAluno = alunos.findIndex(a => a.id === idAluno);

    if (indexAluno === -1) {
        return res.status(404).json({ mensagem: "Aluno não encontrado!"});
    }

    const alunoAtualizado = {
        id: idAluno,
        nome: nome,
        idade: idade
    };

    alunos[indexAluno] = alunoAtualizado;

    res.status(200).json(alunoAtualizado);
})

// Delete
app.delete("/alunos/:id", (req, res) => {
    const idAluno = parseInt(req.params.id);

    const novoArrayAlunos = alunos.filter(a => a.id !== idAluno);

    if (alunos.length === novoArrayAlunos.length) {
        return res.status(404).json({ mensagem: "Aluno não encontrado!" })
    };

    alunos = novoArrayAlunos;

    // Remover o aluno de todas as turmas onde estava matriculado
    turmas.forEach(turma => {
        turma.alunos = turma.alunos.filter(alunoId => alunoId !== idAluno);
    });

    res.status(204).json({ mensagem: "Aluno removido com sucesso!" });
})

// Professores
// Cadastro de novo professor
app.post("/professores", (req, res) => {
    const {nome, idade} = req.body;
    if (!nome || !idade) {
        return res.status(400).json({ mensagem: "Nome e idade são obrigatórios!" });
    }

    const novoProfessor = {
        id: proximoIdProfessor++,
        nome: nome,
        idade: idade
    }
    
    professores.push(novoProfessor);
    res.status(201).json(novoProfessor);
})

// Listagem dos professores
app.get("/professores", (req, res) => {
    res.status(200).json(professores);
});

// Detalhes de um professor
app.get("/professores/:id", (req, res) => {
    const idProfessor = parseInt(req.params.id)

    const professor = professores.find(p => p.id === idProfessor)
    if (!professor) {
        return res.status(404).json({ mensagem: "Professor não encontrado!" })
    }
    res.status(200).json(professor)
});

// Editar um professor
app.put("/professores/:id", (req, res) => {
    const idProfessor = parseInt(req.params.id);
    const { nome, idade } = req.body;

    const indexProfessor = professores.findIndex(p => p.id === idProfessor);

    if (indexProfessor === -1) {
        return res.status(404).json({ mensagem: "Professor não encontrado!"});
    }

    const professorAtualizado = {
        id: idProfessor,
        nome: nome,
        idade: idade
    };

    professores[indexProfessor] = professorAtualizado;

    res.status(200).json(professorAtualizado);
})

// Delete
app.delete("/professores/:id", (req, res) => {
    const idProfessor = parseInt(req.params.id);

    const novoArrayProfessores = professores.filter(p => p.id !== idProfessor);

    if (professores.length === novoArrayProfessores.length) {
        return res.status(404).json({ mensagem: "Professor não encontrado!" })
    };

    professores = novoArrayProfessores;

    res.status(204).json({ mensagem: "Professor removido com sucesso!" });
})

// Turmas
// Cadastro de nova turma
app.post("/turmas", (req, res) => {
    const {nome, professorId} = req.body;
    if (!nome || !professorId) {
        return res.status(400).json({ mensagem: "Nome e professor são obrigatórios!" });
    }

    // verificação
    const professor = professores.find(p => p.id === professorId);
    if (!professor) {
        return res.status(404).json({ mensagem: "Professor não encontrado!" });
    }

    const novaTurma = {
        id: proximoIdTurma++,
        nome: nome,
        professorId: professorId,
        alunos: []
    }
    
    turmas.push(novaTurma);
    res.status(201).json(novaTurma);
})

//Mostrando trumas
app.get("/turmas", (req, res) => {
    res.status(200).json(turmas);
});

// pesquisar turma
app.get("/turmas/:id", (req, res) => {
    const idTurma = parseInt(req.params.id)

    const turma = turmas.find(t => t.id === idTurma)
    if (!turma) {
        return res.status(404).json({ mensagem: "Turma não encontrada!" })
    }
    res.status(200).json(turma)
});

// Editar uma turma (incluindo matrícula/desmatrícula de alunos)
app.put("/turmas/:id", (req, res) => {
    const idTurma = parseInt(req.params.id);
    const { nome, professorId, alunos: alunosIds } = req.body;

    const indexTurma = turmas.findIndex(t => t.id === idTurma);

    if (indexTurma === -1) {
        return res.status(404).json({ mensagem: "Turma não encontrada!"});
    }

    const turmaAtual = turmas[indexTurma];

    if (professorId) {
        const professor = professores.find(p => p.id === professorId);
        if (!professor) {
            return res.status(404).json({ mensagem: "Professor não encontrado!" });
        }
    }

    let alunosFinais = turmaAtual.alunos;
    
    if (alunosIds && Array.isArray(alunosIds)) {
        for (let alunoId of alunosIds) {
            const aluno = alunos.find(a => a.id === alunoId);
            if (!aluno) {
                return res.status(404).json({ mensagem: `Aluno com ID ${alunoId} não encontrado!` });
            }
        }

        alunosFinais = [...new Set(alunosIds)];
    }

    // Atualizar a turma
    const turmaAtualizada = {
        id: idTurma,
        nome: nome || turmaAtual.nome,
        professorId: professorId || turmaAtual.professorId,
        alunos: alunosFinais
    };

    turmas[indexTurma] = turmaAtualizada;

    const alunosCompletos = alunosFinais.map(alunoId => {
        return alunos.find(a => a.id === alunoId);
    }).filter(aluno => aluno !== undefined);

    const professorCompleto = professores.find(p => p.id === turmaAtualizada.professorId);

    res.status(200).json({
        turma: turmaAtualizada,
        professor: professorCompleto?.nome || "Professor não encontrado",
        totalAlunos: alunosCompletos.length,
        alunosMatriculados: alunosCompletos
    });
})

// Delete
app.delete("/turmas/:id", (req, res) => {
    const idTurma = parseInt(req.params.id);

    const novoArrayTurmas = turmas.filter(t => t.id !== idTurma);

    if (turmas.length === novoArrayTurmas.length) {
        return res.status(404).json({ mensagem: "Turma não encontrada!" })
    };

    turmas = novoArrayTurmas;

    res.status(204).json({ mensagem: "Turma removida com sucesso!" });
})

// Listar alunos de uma turma específica
app.get("/turmas/:turmaId/alunos", (req, res) => {
    const turmaId = parseInt(req.params.turmaId);

    // Verificar se a turma existe
    const turma = turmas.find(t => t.id === turmaId);
    if (!turma) {
        return res.status(404).json({ mensagem: "Turma não encontrada!" });
    }

    // Buscar os dados completos dos alunos matriculados
    const alunosMatriculados = turma.alunos.map(alunoId => {
        return alunos.find(a => a.id === alunoId);
    }).filter(aluno => aluno !== undefined); // Remove alunos que não existem mais

    res.status(200).json({
        turma: turma.nome,
        professor: professores.find(p => p.id === turma.professorId)?.nome || "Professor não encontrado",
        totalAlunos: alunosMatriculados.length,
        alunos: alunosMatriculados
    });
});

// criar turma


// IMPORTANTE!!! Iniciar o servidor:
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. Acesse http://localhost:${PORT}`);
})