Docms.cookie = function(e, t, a) {
    if (e = e || "", a = a || "", a = a.match(/([yMdhms]{1})(\d+)/)) switch (a[1]) {
      case "y":
        a = new Date().setFullYear(new Date().getFullYear() + 1 * a[2]);
        break;

      case "M":
        a = new Date().setMonth(new Date().getMonth() + 1 * a[2]);
        break;

      case "d":
        a = new Date().setDate(new Date().getDate() + 1 * a[2]);
        break;

      case "h":
        a = new Date().setHours(new Date().getHours() + 1 * a[2]);
        break;

      case "m":
        a = new Date().setMinutes(new Date().getMinutes() + 1 * a[2]);
        break;

      case "s":
        a = new Date().setSeconds(new Date().getSeconds() + 1 * a[2]);
    }
    console.log(new Date(a));
};