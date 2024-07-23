<template xmlns="http://www.w3.org/1999/html">
  <div>
    <SfButton @click="openModal" variant="tertiary" class="text-sm">
      CGU & CGV
    </SfButton>

    <SfModal v-model="isModalOpen" title="Conditions Générales d'Utilisation et de Vente">
      <div class="modal-content">
        <div class="modal-section">
            <strong>Conditions Générales d’Utilisation et de Vente de OlivePeace</strong>
            <strong>1. Objet</strong>
            <p>
              Les présentes conditions générales ont pour objet de définir les modalités et conditions d’utilisation des services proposés sur le site, ainsi que de définir les droits et obligations des parties dans ce cadre.

            </p>
          </div>

          <div class="modal-section">
          <strong>2. Accès au site et aux services </strong>
          <p>
            L’accès au site et son utilisation sont réservés à un usage strictement personnel. Vous vous engagez à ne pas utiliser ce site et les informations ou données qui y figurent à des fins commerciales, politiques, publicitaires et pour toute forme de sollicitation commerciale et notamment l’envoi de courriers électroniques non sollicités.

          </p>
          </div>

        <div class="modal-section">
        <strong>3. Propriété intellectuelle</strong>
        <p>
          Tous les éléments de ce site, y compris les textes, graphiques, logos, sons, photos, animations, sont la propriété exclusive de l’éditeur du site, à l’exception des marques, logos ou contenus appartenant à d’autres sociétés partenaires ou auteurs.

        </p>
        </div>

        <div class="modal-section">
          <strong>4. Gestion du site</strong>
          <p>
            Pour la bonne gestion du site, l’éditeur pourra à tout moment :

            Suspendre, interrompre ou limiter l’accès à tout ou partie du site, réserver l’accès au site, ou à certaines parties du site, à une catégorie déterminée d’internautes ;
            Supprimer toute information pouvant en perturber le fonctionnement ou entrant en contravention avec les lois nationales ou internationales ;
            Suspendre le site afin de procéder à des mises à jour.
          </p>
        </div>

        <div class="modal-section">
          <strong>5. Responsabilités</strong>
          <p>
            Les informations et services proposés sur le site sont fournis en l’état, sans garantie d’aucune sorte. L’éditeur ne saurait être tenu pour responsable de l’indisponibilité, de l’interruption ou du dysfonctionnement du site, et ce pour quelque raison que ce soit.

          </p>
        </div>

        <div class="modal-section">
          <strong>6. Collecte des données </strong>
          <p>
            Les informations personnelles pouvant être recueillies sur le site sont principalement utilisées par l’éditeur pour la gestion des relations avec vous, et le cas échéant pour le traitement de vos commandes.

          </p>
        </div>

        <div class="modal-section">
          <strong>7. Droit applicable</strong>
          <p>
            Les présentes conditions d’utilisation du site sont régies par la loi française et soumises à la compétence des tribunaux du siège social de l’éditeur, sous réserve d’une attribution de compétence spécifique découlant d’un texte de loi ou réglementaire particulier.
          </p>
        </div>

        <div class="modal-section">
          <strong>8.  Contactez-nous</strong>
          <p>
            Pour toute question, information sur les produits présentés sur le site, ou concernant le site lui-même, vous pouvez laisser un message à l’adresse suivante : contact@olivepeace.com.

          </p>
        </div>

        <template #footer>
          <SfButton @click="closeModal" variant="tertiary">Fermer</SfButton>
        </template>
    </div>

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

.modal-section {
  margin-bottom: 20px;
}
</style>
