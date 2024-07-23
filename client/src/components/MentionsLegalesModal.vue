<template>
  <div>

    <SfButton @click="openModal" variant="tertiary" class="text-sm">
      Mentions légales
    </SfButton>


    <SfModal v-model="isModalOpen" title="Mentions Légales">
      <div class="modal-content">
        <div class="modal-section">
          <strong>Editeur du site :</strong>
          <p>
            OLIVEPEACE HYAROTECH<br>
            SARL au capital de 50.000 €<br>
            123 Avenue de la Paix – 75 010 Paris<br>
            Registre du commerce et des sociétés de Paris, numéro 123 456 789<br>
            TVA intracommunautaire FR 98 123 456 789<br>
            Téléphone : 01 23 45 67 89 (appel non surtaxé)<br>
            Email: contact@olivepeace.com
          </p>
        </div>
        <div class="modal-section">
          <strong>Directeur de la publication :</strong>
          <p> Mme. Olive Martin</p>
        </div>
        <div class="modal-section">
          <strong>Hébergeur du site :</strong>
          <p>
            HYAROTECH SOLUTIONS<br>
            Société à responsabilité limitée de droit français<br>
            Au capital de 1.000.000€<br>
            456 Rue de l’Innovation<br>
            75010 Paris (France),<br>
            Registre du Commerce de Paris, numéro 987 654 321<br>
            TVA intracommunautaire FR 87 987 654 321<br>
            Téléphone: +33 (0)1 23 45 67 89
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

        <style >
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
