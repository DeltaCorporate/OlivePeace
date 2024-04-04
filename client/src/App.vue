<script setup lang="ts">
import {Button} from "@/components/ui/button";

const handleClick = () => {
  let confirmD = confirm('Are you sure you want to do this?')
  if (confirmD) {
    alert('You clicked OK!')
  } else {
    alert('You clicked Cancel!')
  }
}
</script>

<template>
  <Button @click="handleClick">Click me</Button>
</template>
