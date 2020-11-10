<template>
    <form class="form-signin" style="width: 100%;max-width: 420px;padding: 15px;margin: auto; " action="/users/register/" method="post">
      <div class="text-center mb-4">
<!--        <img class="mb-4" src="/docs/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">-->
<!--        <h1 class="h3 mb-3 font-weight-normal">Floating labels</h1>-->
<!--        <p>Build form controls with floating labels via the <code>:placeholder-shown</code> pseudo-element. <a href="https://caniuse.com/#feat=css-placeholder-shown">Works in latest Chrome, Safari, and Firefox.</a></p>-->
      </div>

      <div class="form-label-group">
          <label for="inputEmail">用户名</label>

          <input type="text" id="inputusername" class="form-control" placeholder="username" required="" autofocus="" name="username">

      </div>

      <div class="form-label-group">
          <label for="inputPassword1">密码</label>
          <input type="password" id="inputPassword1" class="form-control" placeholder="password" required="" name="password">

      </div>

        <div class="form-label-group">
          <label for="inputPassword2">确认密码</label>
          <input type="password" id="inputPassword2" class="form-control" placeholder="password" required="" name="password2">

      </div>

       <div class="form-label-group">
        <label for="inputphone">手机号</label>
        <input type="text" id="inputphone" class="form-control" placeholder="phone" required="" autofocus="" name="phone">

      </div>

       <div class="form-label-group">
         <label for="inputEmail">邮箱</label>
          <input type="email" id="inputEmail" class="form-control" placeholder="email" required="" autofocus="" name="email">

      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit" style="margin-top: 30px">注册</button>
      <p class="mt-5 mb-3 text-muted text-center">© 2017-2020</p>
    </form>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.min.css'
    import 'bootstrap/dist/js/bootstrap.min.js'
    export default {
        name: "register"
    }
</script>

<style scoped>

</style>