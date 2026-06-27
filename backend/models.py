import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Aluno(db.Model):
    __tablename__ = "aluno"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False, unique=True)
    xp = db.Column(db.Integer, default=0, nullable=False)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    progressos = db.relationship("ProgressoAluno", back_populates="aluno", lazy="dynamic")
    historico = db.relationship("HistoricoResposta", back_populates="aluno", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "xp": self.xp,
            "nivel": calcular_nivel(self.xp),
            "criado_em": self.criado_em.isoformat(),
        }


class NoDominio(db.Model):
    __tablename__ = "no_dominio"

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(300), nullable=False)
    camada = db.Column(db.Integer, nullable=False)
    prerequisitos_json = db.Column(db.Text, default="[]", nullable=False)
    conteudo = db.Column(db.Text, nullable=False)

    questoes = db.relationship("Questao", back_populates="no", lazy="dynamic")
    progressos = db.relationship("ProgressoAluno", back_populates="no", lazy="dynamic")

    @property
    def prerequisitos(self):
        return json.loads(self.prerequisitos_json or "[]")

    @prerequisitos.setter
    def prerequisitos(self, value):
        self.prerequisitos_json = json.dumps(value)

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "camada": self.camada,
            "prerequisitos": self.prerequisitos,
            "conteudo": self.conteudo,
        }


class Questao(db.Model):
    __tablename__ = "questao"

    id = db.Column(db.Integer, primary_key=True)
    no_id = db.Column(db.Integer, db.ForeignKey("no_dominio.id"), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # 'multipla_escolha' | 'aberta'
    enunciado = db.Column(db.Text, nullable=False)
    alternativas_json = db.Column(db.Text, default="[]", nullable=False)
    resposta_correta = db.Column(db.Text, nullable=True)
    palavras_chave_json = db.Column(db.Text, default="[]", nullable=False)
    feedback_erro = db.Column(db.Text, nullable=True)
    paragrafo_ref = db.Column(db.String(100), nullable=True)

    no = db.relationship("NoDominio", back_populates="questoes")
    historico = db.relationship("HistoricoResposta", back_populates="questao", lazy="dynamic")

    @property
    def alternativas(self):
        return json.loads(self.alternativas_json or "[]")

    @alternativas.setter
    def alternativas(self, value):
        self.alternativas_json = json.dumps(value, ensure_ascii=False)

    @property
    def palavras_chave(self):
        return json.loads(self.palavras_chave_json or "[]")

    @palavras_chave.setter
    def palavras_chave(self, value):
        self.palavras_chave_json = json.dumps(value, ensure_ascii=False)

    def to_dict(self):
        return {
            "id": self.id,
            "no_id": self.no_id,
            "tipo": self.tipo,
            "enunciado": self.enunciado,
            "alternativas": self.alternativas,
            "resposta_correta": self.resposta_correta,
            "palavras_chave": self.palavras_chave,
            "feedback_erro": self.feedback_erro,
            "paragrafo_ref": self.paragrafo_ref,
        }


class ProgressoAluno(db.Model):
    __tablename__ = "progresso_aluno"

    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey("aluno.id"), nullable=False)
    no_id = db.Column(db.Integer, db.ForeignKey("no_dominio.id"), nullable=False)
    dominio = db.Column(db.Integer, default=0, nullable=False)  # 0-100
    tentativas = db.Column(db.Integer, default=0, nullable=False)
    acertos = db.Column(db.Integer, default=0, nullable=False)
    erros_consecutivos = db.Column(db.Integer, default=0, nullable=False)

    aluno = db.relationship("Aluno", back_populates="progressos")
    no = db.relationship("NoDominio", back_populates="progressos")

    __table_args__ = (
        db.UniqueConstraint("aluno_id", "no_id", name="uq_progresso_aluno_no"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "aluno_id": self.aluno_id,
            "no_id": self.no_id,
            "dominio": self.dominio,
            "tentativas": self.tentativas,
            "acertos": self.acertos,
            "erros_consecutivos": self.erros_consecutivos,
        }


class HistoricoResposta(db.Model):
    __tablename__ = "historico_resposta"

    id = db.Column(db.Integer, primary_key=True)
    aluno_id = db.Column(db.Integer, db.ForeignKey("aluno.id"), nullable=False)
    questao_id = db.Column(db.Integer, db.ForeignKey("questao.id"), nullable=False)
    correta = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    aluno = db.relationship("Aluno", back_populates="historico")
    questao = db.relationship("Questao", back_populates="historico")

    def to_dict(self):
        return {
            "id": self.id,
            "aluno_id": self.aluno_id,
            "questao_id": self.questao_id,
            "correta": self.correta,
            "timestamp": self.timestamp.isoformat(),
        }


def calcular_nivel(xp: int) -> str:
    if xp <= 100:
        return "Recruta"
    elif xp <= 300:
        return "Soldado"
    elif xp <= 600:
        return "Sargento"
    elif xp <= 1000:
        return "Tenente"
    else:
        return "General"
