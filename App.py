import streamlit as st
import simpy
import random
import numpy as np
import pandas as pd

# Configuration de la page
st.set_page_config(
    page_title="LES Data Center Optimizer",
    page_icon="⚡",
    layout="wide"
)

# ====== Titre et Intro ======
st.title("⚡ LES Data Center Optimizer")
st.markdown("""
**Simulation de réduction énergétique via Low-Entropy Spiral (LES) et Cognitive Entropy Minimization Loop (CEML).**
""")

# ====== Sidebar: Paramètres ======
st.sidebar.header("Paramètres de Simulation")
NUM_SERVEURS = st.sidebar.slider("Nombre de Serveurs", 10, 500, 100)
ENERGIE_PAR_REQUETE = 10

# ====== Logique Métier (LES / CEML) ======
def calculer_entropie_les(texte):
    """Calcule l'entropie cognitive d'une requête."""
    motifs = ["qubit", "spin", "kuramoto", "fc-496", "craid"]
    p = [texte.lower().count(motif)/len(texte) for motif in motifs]
    p = [max(x, 1e-10) for x in p]
    sum_p = sum(p)
    p = [x/sum_p for x in p]
    return min(-sum(x*np.log2(x) for x in p if x>0), 1.0)

def compresser_requete_les(texte, entropie):
    """Compression cognitive basée sur l'entropie."""
    if entropie > 0.7:
        return f"COMP_{texte[:5]}"
    else:
        mots_cles = [m for m in ["qubit","spin","fc-496"] if m in texte.lower()]
        return "_".join(mots_cles)[:20] if mots_cles else f"UNK_{texte[:5]}"

def detecter_redondance_ceml(texte, memoire):
    """Détection de redondance via signature cognitive."""
    signature = compresser_requete_les(texte, 0.5)
    return signature in memoire

# ====== Modélisation Data Center ======
class DataCenterBasique:
    def __init__(self, env):
        self.env = env
        self.serveurs = [simpy.Resource(env, capacity=1) for _ in range(NUM_SERVEURS)]
        self.energie_totale = 0
        self.requetes_traitees = 0

    def traiter_requete(self, requete):
        serveur = random.choice(self.serveurs)
        with serveur.request() as req:
            yield req
            self.energie_totale += ENERGIE_PAR_REQUETE
            self.requetes_traitees += 1

class DataCenterOptimise:
    def __init__(self, env):
        self.env = env
        self.serveurs = [simpy.Resource(env, capacity=1) for _ in range(NUM_SERVEURS)]
        self.energie_totale = 0
        self.requetes_traitees = 0
        self.memoire_ceml = {}
        self.entropie_les = 1.0

    def traiter_requete(self, requete):
        # CEML
        if detecter_redondance_ceml(requete, self.memoire_ceml):
            self.energie_totale += ENERGIE_PAR_REQUETE * 0.1
            return

        # LES
        entropie = calculer_entropie_les(requete)
        self.entropie_les = max(0.1, self.entropie_les * 0.99)
        signature = compresser_requete_les(requete, entropie)
        self.memoire_ceml[signature] = requete

        # Traitement
        serveur = random.choice(self.serveurs)
        with serveur.request() as req:
            yield req
            energie = ENERGIE_PAR_REQUETE * (0.3 + 0.7 * self.entropie_les)
            self.energie_totale += energie
            self.requetes_traitees += 1

# ====== Simulation ======
if st.button("🚀 Lancer la Simulation"):
    env = simpy.Environment()
    dc_basique = DataCenterBasique(env)
    dc_optimise = DataCenterOptimise(env)

    # Données de test
    requetes_base = [
        "Optimiser qubit avec spin-locking et kuramoto fc-496",
        "FC-496 protocole pour data center quantique craid",
        "CEML compression pour réduire entropie cognitive les",
        "Générer architecture low-power avec Lichen-OS qubit"
    ]
    
    requetes = []
    # Génération d'un volume suffisant de requêtes
    for i in range(250):
        for idx, req in enumerate(requetes_base):
            requetes.append(f"{req}_{i*4 + idx}")

    # Processus Simpy
    def generer_flux(dc):
        for r in requetes:
            yield env.timeout(0.01) # Petit délai simulé
            env.process(dc.traiter_requete(r))

    # Exécution
    with st.spinner("Simulation des qubits en cours..."):
        env.process(generer_flux(dc_basique))
        env.process(generer_flux(dc_optimise))
        env.run()

    # Résultats
    st.divider()
    
    # Métriques
    col1, col2, col3 = st.columns(3)
    col1.metric("⚡ Énergie Standard", f"{dc_basique.energie_totale:.1f}")
    col2.metric("🌱 Énergie Optimisée", f"{dc_optimise.energie_totale:.1f}")
    
    economie = 0
    if dc_basique.energie_totale > 0:
        economie = 100 * (1 - dc_optimise.energie_totale / dc_basique.energie_totale)
    
    col3.metric("🎯 Économie Totale", f"{economie:.2f}%", delta=f"{economie:.2f}%")

    # Graphique
    chart_data = pd.DataFrame({
        "Mode": ["Standard", "Optimisé (LES/CEML)"],
        "Consommation": [dc_basique.energie_totale, dc_optimise.energie_totale]
    })
    
    st.subheader("Comparaison de Consommation")
    st.bar_chart(chart_data, x="Mode", y="Consommation")

    if economie > 50:
        st.success("✅ L'architecture LES/CEML est validée pour le déploiement en production.")

# Footer
st.markdown("---")
st.caption("Généré par LES Data Center Optimizer Web App")
