<script setup lang="ts">
import {Button} from "@/components/ui/button";

const handleClick = () => {
  let confirmD = confirm('Are you sure you want to do this?')
  if (confirmD) {
    alert('Product added')
  } else {
    alert('You clicked Cancel!')
  }
}
</script>

<template>
  <Button variant="destructive" @click="handleClick">Add to Cart</Button>
</template>
