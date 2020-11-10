<template>
      <form class="form-signin" style="width: 100%;max-width: 420px;padding: 15px;margin: auto;" action="/users/login/" method="post" >‘
      <div class="text-center mb-4">
<!--        <img class="mb-4" src="/docs/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">-->
      </div>

      <div class="form-label-group">
          <label for="inputusername">用户名</label>
        <input type="text" id="inputusername" class="form-control" placeholder="Username" required="" autofocus="" name="username">

      </div>

      <div class="form-label-group">
          <label for="inputPassword">密码</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="" name="password">

      </div>

      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">登录</button>
      <p class="mt-5 mb-3 text-muted text-center">© 2020</p>
    </form>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.min.css'
    import 'bootstrap/dist/js/bootstrap.min.js'
    export default {
        name: "login"
    }
</script>

<style scoped>

</style>