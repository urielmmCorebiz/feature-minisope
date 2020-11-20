var dmlscript = document.createElement("script");
dmlscript.src = "https://http2.mlstatic.com/storage/bmsdk/js/dml-0.0.7.min.js";

dmlscript.onload = () => {
  new DMLSDK({
    publicKey: "APP_USR-84f1a475-00c1-4746-98a9-65cf84608c81",
    out: "vtex.deviceFingerprint",
  });
};

verifyPostalCode = () => {
  if ($("body.body-cart").length) {
    $("#shipping-calculate-link").click();
    vtexjs.checkout.orderForm.shippingData.address != null
      ? $("#shipping-preview-container").removeClass("focusBlock")
      : $("#shipping-preview-container").addClass("focusBlock");
  }
};

document.body.appendChild(dmlscript);

function appendTerms() {
  var $htmlBtn =
    '<p class="acept-terms"><label class="checkbox acept-terms-label" for="opt-in-acept-terms"><input type="checkbox" id="opt-in-acept-terms"><span class="acept-terms-text">Acepto <a href="/terminos-y-condiciones" target="_blank">Términos y Condiciones</a>.</span></label></p><p class="acept-terms"><label class="checkbox acept-terms-label" for="opt-in-acept-privacy"><input type="checkbox" id="opt-in-acept-privacy"><span class="acept-terms-text">Acepto el <a href="/aviso-de-privacidad" target="_blank">Aviso de Privacidad</a>.</span></label></p>';

  if (
    $("#client-profile-data form .acept-terms #opt-in-acept-terms").length == 0
  ) {
    $(
      "#client-profile-data .accordion-group.client-profile-data .box-client-info"
    ).append($htmlBtn);

    $("#go-to-payment,#go-to-shipping").click(function (event) {
      if (
        $("#client-profile-data form .acept-terms #opt-in-acept-terms:checked")
          .length == 0 ||
        $(
          "#client-profile-data form .acept-terms #opt-in-acept-privacy:checked"
        ).length == 0
      ) {
        $(".acept-terms-text").addClass("required-alert");
        return false;
      } else {
        $(".acept-terms-text").removeClass("required-alert");
        return true;
      }
    });
  }
}

function replaces() {
  $("p.notification").each(function () {
    let txt = $(this)
      .text()
      .replace(
        "Aún falta llenar con los datos",
        "Aún falta completar los datos"
      );
    $(this).html(txt);
  });
}

function tagInventoryOff() {
  if (!typeof dataLayer == "undefined") {
    var messageUnavailable = "";
    var cp = $("#ship-postalCode").val();

    if ($(".item-unavailable-message").length > 0) {
      messageUnavailable = $(
        ".item-unavailable-message span[data-bind='visible: unavailableForDelivery']"
      ).text();
      window.dataLayer.push({ messageUnavailable: messageUnavailable });
      window.dataLayer.push({ codigoPostal: cp });
    } else {
      messageUnavailable = "Sin errores";
      window.dataLayer.push({ messageUnavailable: messageUnavailable });
      window.dataLayer.push({ codigoPostal: cp });
    }
  }
}

function hashController() {
  var url = window.location.href;

  appendTerms();
  termsCond();

  if (url.includes("/cart")) {
    $(".item-cart").addClass("active");
    $(".item-shipping").removeClass("active");
    $(".item-payment").removeClass("active");
  } else if (url.includes("/payment")) {
    $(".item-cart").removeClass("active");
    $(".item-shipping").removeClass("active");
    $(".item-payment").addClass("active");
  } else if (url.includes("/shipping") || url.includes("/profile")) {
    $(".item-cart").removeClass("active");
    $(".item-payment").removeClass("active");
    $(".item-shipping").addClass("active");
  }
}

var timeout = 1000;

window.onhashchange = function () {
  hashController();
  replaceText();
  addClassStore();
  shippingText();

  setTimeout(() => {
    hashController();
    addClassStore();
  }, timeout);
};

window.onload = function () {
  hashController();
  replaceText();
  addClassStore();
  shippingText();
  setTimeout(() => {
    hashController();
  }, timeout);
};

$(document).ready(function () {
  appendTerms();
  termsCond();
  addClassStore();
  changeContent();
  shippingText();

  if ($(".empty-cart-content").css("display") == "none") {
    var suggestion = document.createElement("script");
    suggestion.src = "/files/checkout6-suggestions.js";
    document.body.appendChild(suggestion);
  }

  $("#client-pre-email").attr("placeholder", "tu@correo.com");

  //OBSERVE DOM
  const observer = new MutationObserver((list) => {
    const evt = new CustomEvent("dom-changed", { detail: list });
    document.body.dispatchEvent(evt);
  });
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  if (window.location.hash == "#/shipping") {
    document.body.addEventListener("dom-changed", () => {
      setTimeout(function () {
        if ($(".vtex-pickup-points-modal-3-x-pointsItem").length < 2) {
          $(".vtex-pickup-points-modal-3-x-pointsList").addClass(
            "onlyOneAvailable"
          );
        }
      }, 1300);
    });
  } else {
    document.body.removeEventListener("dom-changed", () => {
      console.log("observeRemoved");
    });
  }
  //END OBSERVE DOM
});

$(document).ajaxStop(function () {
  tagInventoryOff();
  //verifyPostalCode()
  replaces();

  $("#shipping-calculate-link").click();
  $("#client-pre-email").attr("placeholder", "tu@correo.com");
  setTimeout(function () {
    $(".shp-method-option:first-of-type").hasClass("shp-method-option-active")
      ? $("#postalCode-finished-loading").removeClass().addClass("toHome")
      : $("#postalCode-finished-loading").removeClass().addClass("toPickup");
  }, 0);
  if ($(".vtex-pickup-points-modal-3-x-pointsItem").length < 2) {
    $(".vtex-pickup-points-modal-3-x-pointsList").addClass("onlyOneAvailable");
  }
});

function termsCond() {
  const $htmlBtn =
    '<p class="terms-cond">Al dar click en Comprar ahora acepto <a href="/terminos-y-condiciones" target="_blank">Términos y Condiciones</a> y <a href="/aviso-de-privacidad" target="_blank">Aviso de Privacidad</a>';

  if (
    $(".payment-confirmation-wrap").length == 1 &&
    $(".terms-cond").length < 1
  ) {
    $(".payment-confirmation-wrap").append($htmlBtn);
  }
}

function limitText(field, maxChar) {
  var ref = $(field),
    val = ref.val();
  if (val.length >= maxChar) {
    ref.val(function () {
      //console.log(val.substr(0, maxChar))
      return val.substr(0, maxChar);
    });
  }
}

$(window).on("componentValidated.vtex", function (event, orderForm) {
  replaceText();
  addClassStore();
  changeContent();
});

$(window).on("orderFormUpdated.vtex", function (event, orderForm) {
  replaceText();
  addClassStore();
  changeContent();
});

function changeContent() {
  $(".vtex-omnishipping-1-x-leanShippingOptionRadio.shp-option-radio").each(
    function (index, element) {
      var htmlContainer = $(this).val();
      if (htmlContainer.includes("Recoger en Tienda")) {
        if ($(this).is(":checked")) {
          const text14 = $(".delivery-address-title")
            .text()
            .replace("Dirección de entrega", "Confirma tu dirección");
          $(".delivery-address-title").text(text14);
          $(".address-list > *").hide();
          if ($(".select-store-client").length == 0) {
            $(
              '<span class="select-store-client">' + htmlContainer + "</span>"
            ).insertBefore(".address-list");
          }
        }
      }
    }
  );
  $(".vtex-omnishipping-1-x-leanShippingOptionRadio.shp-option-radio").on(
    "click",
    function () {
      var htmlContainer = $(this).val();
      $("#tienda-seleccionada").hide();
      $(".select-store-client").css("display", "none");
      if (htmlContainer.includes("Recoger en Tienda")) {
        if ($(this).is(":checked")) {
          $(".address-list > *").hide();
          $(
            '<span class="select-store-client">' + htmlContainer + "</span>"
          ).insertBefore(".address-list");
          if ($(".delivery-address-title").length) {
            const text14 = $(".delivery-address-title")
              .text()
              .replace("Dirección de entrega", "Confirma tu dirección");
            $(".delivery-address-title").text(text14);
          }
        } else {
          $(".address-list > *").show();
        }
      } else {
        $(".address-list > *").show();
        if ($(".delivery-address-title").length) {
          const text15 = $(".delivery-address-title")
            .text()
            .replace("Confirma tu dirección", "Dirección de entrega");
          $(".delivery-address-title").text(text15);
        }
      }
    }
  );
}

function shippingText() {
  if (window.location.href.includes("/payment")) {
    $(".address-summary").hide();
    vtexjs.checkout.getOrderForm().done(function (orderForm) {
      var textoSeleccionado =
        orderForm.shippingData.logisticsInfo[0].selectedSla;

      if ($(".text-seleccionado").length == 0) {
        $(
          '<span class="text-seleccionado">' + textoSeleccionado + "</span>"
        ).insertBefore(".address-summary");
      }
    });
  }
}

function addClassStore() {
  if ($("#title-do").length) {
  } else {
    $(".envio")
      .children(":first")
      .before(
        "<div id='title-do' class='type-title'>Entrega a Domicilio</div>"
      );
  }
  if ($("#title-stor").length) {
  } else {
    $(".recogerTienda")
      .children(":first")
      .before(
        "<div  id='title-stor' class='type-title'>Recoger en Tienda</div>"
      );
  }
  $(".vtex-omnishipping-1-x-leanShippingGroupList.shp-lean > div").each(
    function () {
      $(this).addClass("envio");
      var textFiled = $(this).find(".shp-option-text-label").text();
      if (textFiled.includes("Recoger en Tienda")) {
        $(this).addClass("recogerTienda");
        $(this).removeClass("envio");
      }
    }
  );
}

function replaceText() {
  if ($("#shipping-option-delivery .shp-method-option-text").length) {
    const text1 = $("#shipping-option-delivery .shp-method-option-text")
      .text()
      .replace("Recibir", "Envío");
    $("#shipping-option-delivery .shp-method-option-text").text(text1);
  }
  if ($("#shipping-option-delivery .shp-method-option-complement").length) {
    const text2 = $("#shipping-option-delivery .shp-method-option-complement")
      .text()
      .replace("en domicilio", "a domicilio");
    $("#shipping-option-delivery .shp-method-option-complement").text(text2);
  }
  if (
    $("#shipping-option-pickup-in-point .shp-method-option-complement").length
  ) {
    const text3 = $(
      "#shipping-option-pickup-in-point .shp-method-option-complement"
    )
      .text()
      .replace("en un punto", "en tienda");
    $("#shipping-option-pickup-in-point .shp-method-option-complement").text(
      text3
    );
  }
  if ($(".vtex-omnishipping-1-x-findPickup #change-pickup-button").length) {
    const text6 = $(".vtex-omnishipping-1-x-findPickup #change-pickup-button")
      .text()
      .replace(
        "Ver todos los puntos de retirada",
        "Ver todas las tiendas disponibles para recoger tu pedido"
      );
    $(".vtex-omnishipping-1-x-findPickup #change-pickup-button").text(text6);
  }
  if (
    $(
      ".vtex-omnishipping-1-x-leanShippingText .shp-option-text-label-single span"
    ).length
  ) {
    const text7 = $(
      ".vtex-omnishipping-1-x-leanShippingText .shp-option-text-label-single span"
    )
      .text()
      .replace("hasta", "");
    $(
      ".vtex-omnishipping-1-x-leanShippingText .shp-option-text-label-single span"
    ).text(text7);
  }
  if (
    $(".vtex-omnishipping-1-x-summaryPackage  .shp-summary-package-time").length
  ) {
    const text10 = $(
      ".vtex-omnishipping-1-x-summaryPackage  .shp-summary-package-time"
    )
      .text()
      .replace("hasta", "");
    $(".vtex-omnishipping-1-x-summaryPackage  .shp-summary-package-time").text(
      text10
    );
  }

  if ($("p.srp-description").length) {
    const text13 = $("p.srp-description")
      .text()
      .replace(
        "Vea todas las opciones de envío para sus productos, incluidas las tarifas y los precios de envío",
        "Conoce todas las opciones de entrega que tenemos con sólo ingresar tu código postal. "
      );
    $(".srp-description").text(text13);
  }

  if (
    $("#shipping-option-pickup-in-point .shp-method-option-complement").length
  ) {
    const text33 = $(
      "#shipping-option-pickup-in-point .shp-method-option-complement"
    )
      .text()
      .replace("en tienda de recogida", "en tienda");
    $("#shipping-option-pickup-in-point .shp-method-option-complement").text(
      text33
    );
  }

  if ($("#change-pickup-button").length) {
    const text34 = $("#change-pickup-button")
      .text()
      .replace("Ver todos los puntos de recogida", "Ver todas las tiendas");
    $("#change-pickup-button").text(text34);
  }
}
