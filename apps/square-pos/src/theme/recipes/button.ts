// // Create an "extended" recipe with new defaults/variants

// import { button } from '~/styled-system/recipes'

// const extraVariants = {
//     variant: ['primary', 'outlined', 'dashed', 'default', 'text', 'link', 'ghost', 'success'],
//     size: ['sm', 'md', 'lg', 'icon', 'xl'],
//     shape: ['default', 'rounded', 'circle', 'pill'],
//     width: ['full'],
//     colorScheme: ['red', 'blue', 'green'] // example new variant
//   }

//   // Create a recipe with the extra variants and any new defaults/styles
//   const extraButtonFn = createRecipe(
//     'button',
//     {
//       variant: 'ghost',
//       size: 'md',
//     },
//     [
//       // Example new compound variant style
//       {
//         variant: 'success',
//         size: 'lg',
//         css: { backgroundColor: 'green', color: 'white' }
//       },
//       {
//         colorScheme: 'red',
//         css: { backgroundColor: 'red', color: 'white' }
//       }
//     ]
//   )

//   // Merge original button and extended one
//   export const superButton = button.merge(extraButtonFn)

//   // Override/extend the variantMap so your new recipe recognizes extra variants
//   superButton.variantMap = {
//     ...superButton.variantMap,
//     ...extraVariants
//   }

//   superButton.variantKeys = Object.keys(superButton.variantMap)
