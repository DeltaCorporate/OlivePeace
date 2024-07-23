<template>

  <div>

    <SfButton @click="openModal" variant="tertiary" class="text-sm">
      Politique de confidentialité
    </SfButton>

    <SfModal v-model="isModalOpen" title="Politique de Confidentialité">
      <div class="modal-content">
        <div class="modal-section">
          <strong>1. Introduction</strong>
          <p>
            Chez OlivePeace, nous nous engageons à protéger la vie privée de nos clients. Cette politique de confidentialité explique comment nous utilisons les informations personnelles que nous collectons lorsque vous utilisez notre site web.
          </p>
        </div>
        <div class="modal-section">
          <strong>2. Quelles données collectons-nous ?</strong>
          <p>
            OlivePeace recueille les données suivantes :
            Informations d'identification personnelle (nom, adresse email, numéro de téléphone, etc.)
            Détails de transactions et de paiements
            Historique de navigation et préférences d'achat
          </p>
        </div>

        <div class="modal-section">
          <strong>3. Comment collectons-nous vos données ? </strong>
          <p>
            Vous fournissez directement à OlivePeace la plupart des données que nous collectons. Nous recueillons des données et traitons des données lorsque vous :
            Effectuez un achat en ligne
            Volontairement complétez un sondage client ou fournissez un retour d’information sur nos produits ou services
            Utilisez ou visualisez notre site web via les cookies de votre navigateur
          </p>
        </div>
        <div class="modal-section">
          <strong>4. Comment utiliserons-nous vos données ?</strong>
          <p>
            Traiter vos commandes et gérer votre compte.
            Vous contacter avec des offres spéciales sur des produits et services que nous pensons vous plaire.
          </p>
        </div>
        <div class="modal-section">
          <strong>5. Comment stockons-nous vos données ?</strong>
          <p>
            OlivePeace sécurise vos données en utilisant des mesures de sécurité de pointe pour prévenir l’accès non autorisé, la divulgation, la modification ou la destruction de vos informations personnelles.

          </p>
        </div>

        <div class="modal-section">
          <strong>6.  Marketing</strong>
          <p>
            OlivePeace aimerait vous envoyer des informations sur les produits et services de notre entreprise qui pourraient vous intéresser. Si vous avez accepté de recevoir du marketing, vous pouvez toujours opter pour un désabonnement à une date ultérieure.

          </p>
        </div>

        <div class="modal-section">
          <strong>7. Vos droits de protection des données </strong>
          <p>
            OlivePeace souhaite vous assurer que vous êtes pleinement conscient de tous vos droits en matière de protection des données. Chaque utilisateur a droit à :

            Le droit d’accès – Vous avez le droit de demander à OlivePeace des copies de vos données personnelles.
            Le droit de rectification – Vous avez le droit de demander que OlivePeace corrige toute information que vous croyez inexacte ou incomplète.
            Le droit à l’effacement – Vous avez le droit de demander que OlivePeace efface vos données personnelles, sous certaines conditions.

          </p>
        </div>

        <div class="modal-section">
          <strong>8.  Cookies</strong>
          <p>
            Les cookies sont des fichiers texte placés sur votre ordinateur pour collecter des informations de journal Internet standard et des informations sur le comportement des visiteurs. Lorsque vous visitez nos sites web, nous pouvons collecter des informations vous concernant automatiquement grâce à des cookies ou à une technologie similaire.

          </p>
        </div>

        <div class="modal-section">
          <strong>9. Politique de confidentialité d’autres sites web</strong>
          <p>
            Le site web OlivePeace contient des liens vers d’autres sites web. Notre politique de confidentialité s’applique uniquement à notre site web, donc si vous cliquez sur un lien vers un autre site web, vous devriez lire leur politique de confidentialité.
                      </p>
        </div>

        <div class="modal-section">
          <strong>10. Changements à notre politique de confidentialité </strong>
          <p>
            OlivePeace révise régulièrement sa politique de confidentialité et place toute mise à jour sur cette page web. Cette politique de confidentialité a été mise à jour pour la dernière fois le 20/07/2024.
          </p>
        </div>

        <div class="modal-section">
          <strong>11. Comment nous contacter</strong>
          <p>
            Si vous avez des questions sur la politique de confidentialité d’OlivePeace, les données que nous détenons à votre sujet, ou si vous souhaitez exercer l’un de vos droits de protection des données, n’hésitez pas à nous contacter.
          </p>
        </div>

        <div class="modal-section">
          <strong>12. Comment contacter l’autorité appropriée</strong>
          <p>
            Si vous souhaitez signaler une plainte ou si vous pensez que OlivePeace n’a pas répondu à votre préoccupation de manière satisfaisante, vous pouvez contacter l’Information Commissioner’s Office.
          </p>
        </div>
      </div>
      <template #footer>
        <SfButton @click="closeModal" variant="tertiary">Fermer</SfButton>
      </template>
    </SfModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { SfButton, SfModal } from '@storefront-ui/vue';

const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style>
.modal-content {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.modal-section {
  margin-bottom: 20px;
}

.close-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #0056b3;
}
</style>
