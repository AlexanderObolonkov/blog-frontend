<template>
  <div class="container-fluid home-slider">
    <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
        <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="/img/first_img.jpg" class="d-block w-100" alt="Первая картинка">
          <div class="carousel-caption d-none d-md-block">
            <h5>Это описание первого слайда</h5>
            <p>Съешь еще этих мягких французских булок да выпей чаю</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="/img/second_image.jpg" class="d-block w-100" alt="Вторая картинка">
          <div class="carousel-caption d-none d-md-block">
            <h5>Это описание второго слайда</h5>
            <p>42 - ответ на главный вопрос жизни вселенной и всего такого</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="/img/third_img.jpg" class="d-block w-100" alt="Третья картинка">
          <div class="carousel-caption d-none d-md-block">
            <h5>Это описание третьего слайда</h5>
            <p>Тут можно писать все что угодно</p>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Slider"
}
</script>

<style scoped></style>