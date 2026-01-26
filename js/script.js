const lightbox = GLightbox()

document.addEventListener('DOMContentLoaded', () => {
  resizeImages()
})

window.addEventListener('resize', () => {
  resizeImages()
})

function resizeImages() {
  const container = getContainer()
  const width = window.innerWidth
  const totalImages = getTotalImagesByRow(width)

  if (totalImages === 1) {
    resetImagesSizeForMobile(container)
    container.classList.add('mobile-size')
  } else {
    container.classList.remove('mobile-size')
    calculateHeightAndSetToImages(container, getContainerWidth(totalImages), totalImages)
  }
}

function getTotalImagesByRow(width) {
  if (width >= 1280) {
    return 5
  } else if (width >= 1024) {
    return 4
  } else if (width >= 768) {
    return 3
  } else if (width >= 600) {
    return 2
  } else {
    return 1
  }
}

function resetImagesSizeForMobile(container) {
  for (const image of container.children) {
    image.style.width = 'auto'
    image.style.height = 'auto'
  }
}

function calculateHeightAndSetToImages(container, width, totalImages) {
  const totalImagesInContainer = container.children.length

  for (let index = 0; index < totalImagesInContainer; index += totalImages) {
    const imageList = Array.from(container.children).slice(index, index + totalImages)

    const totalVerticalImages = getTotalImagesInListByClassName(imageList, 'grid-item-vertical')
    const totalSquareImages = getTotalImagesInListByClassName(imageList, 'grid-item-square')

    const heightObject = calculateRowHeight(totalImages, totalVerticalImages, totalSquareImages)
    let padding = heightObject.padding

    const widthWithPadding = imagesWithPaddingWidth(
      heightObject.newWidth,
      totalImages,
      heightObject.padding
    )

    if (width < widthWithPadding) {
      padding -= 1
    }

    Array.from(container.children)
      .slice(index, index + totalImages)
      .forEach((image, imageIndex) => {
        image.style.height = heightObject.height + 'px'
        image.style.width = 'auto'
        image.style.marginRight = ''

        if (imageIndex < totalImages - 1) {
          image.style.marginRight = padding + 'px'
        }
      })
  }
}

function imagesWithPaddingWidth(width, totalImages, padding) {
  return width + padding * (totalImages - 1)
}

function getTotalImagesInListByClassName(list, className) {
  let verticalImages = 0

  for (const image of list) {
    if (image.classList.contains(className)) {
      verticalImages++
    }
  }

  return verticalImages
}

function calculateRowHeight(totalImages, totalVerticalImages, totalSquareImages) {
  const width = getContainerWidth(totalImages)

  if (totalVerticalImages === totalImages) {
    return getRowHeightForOnlyVerticalImages(width, totalImages, totalVerticalImages)
  }

  if (totalSquareImages == totalImages) {
    return getRowHeightForOnlySquareImages(width, totalImages)
  }

  if (totalVerticalImages === 0 && totalSquareImages == 0) {
    return getRowHeightForOnlyHorizontalImages(width, totalImages)
  }

  const totalHorizontalImages = totalImages - totalVerticalImages - totalSquareImages

  /*
    This calculation is based on this algebric formula:

    Width of container = (horizontal images * 3 height) + (vertical images * 2 height) + (square images * 1 height)
                                              ________                       ________
                                                 2                              3                            
  */

  const height =
    (width * 6) / (9 * totalHorizontalImages + 4 * totalVerticalImages + 6 * totalSquareImages)

  let newWidth = calculateRowWidthWithNewHeight(
    totalHorizontalImages,
    totalVerticalImages,
    totalSquareImages,
    height
  )

  const spaceForPadding = getContainer().clientWidth - newWidth
  let padding = Math.floor(spaceForPadding / (totalImages - 1))

  return {
    height: height,
    padding: padding,
    newWidth: newWidth,
  }
}

function getRowHeightForOnlySquareImages(width, totalImages) {
  return {
    padding: getPadding(),
    height: width / totalImages,
    newWidth: width,
  }
}

function getRowHeightForOnlyVerticalImages(width, totalImages, totalVerticalImages) {
  return {
    padding: getPadding(),
    height: (width / totalImages) * getHorizonalRatio(),
    newWidth: calculateRowWidthWithNewHeight(
      0,
      totalVerticalImages,
      0,
      (width / totalImages) * 1.5
    ),
  }
}

function getRowHeightForOnlyHorizontalImages(width, totalImages) {
  return {
    padding: getPadding(),
    height: (width / totalImages) * getVerticalRatio(),
    newWidth: calculateRowWidthWithNewHeight(
      totalImages,
      0,
      0,
      (width / totalImages) * getVerticalRatio()
    ),
  }
}

function calculateRowWidthWithNewHeight(horizontal, vertical, square, height) {
  const horizontalWidth = height * getHorizonalRatio()
  const verticalWidth = height * getVerticalRatio()
  const squareWidth = height

  const totalWidth = horizontalWidth * horizontal + verticalWidth * vertical + squareWidth * square

  return totalWidth
}

function getContainerWidth(totalImages) {
  const container = getContainer()
  const padding = getPadding()

  return container.clientWidth - (totalImages - 1) * padding
}

function getPadding() {
  return 20
}

function getHorizonalRatio() {
  return 1.5
}

function getVerticalRatio() {
  return 2 / 3
}

function getContainer() {
  return document.getElementsByClassName('grid-container')[0]
}
