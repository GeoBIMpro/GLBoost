var arg = new Object;
var pair = location.search.substring(1).split('&');
for(var i = 0; pair[i] ; i++) {
  var kv = pair[i].split('=');
  arg[kv[0]] = kv[1];
}

GLBoost.VALUE_TARGET_WEBGL_VERSION = arg.webglver ? parseInt(arg.webglver) : 1;

var SCREEN_WIDTH = 512;
var SCREEN_HEIGHT = 512;

phina.globalize();

phina.define('MainScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);

    var layer = phina.display.GLBoostLayer({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT
    }).addChildTo(this);

    var glBoostContext = layer.glBoostContext;
    var renderTextures = glBoostContext.createTexturesForRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, 1);
    var renderPasses = glBoostContext.createRenderPasses(2);

    var positions = [
      new GLBoost.Vector3(-0.5, -0.5, 0.0),
      new GLBoost.Vector3(0.5, -0.5, 0.0),
      new GLBoost.Vector3(-0.5,  0.5, 0.0),

      new GLBoost.Vector3(-0.5, 0.5, 0.0),
      new GLBoost.Vector3(0.5, -0.5, 0.0),
      new GLBoost.Vector3(0.5,  0.5, 0.0)
    ];
    var shapetarget_1 = [
      new GLBoost.Vector3(-1.0, -0.5, 0.0),
      new GLBoost.Vector3(1.0, -0.5, 0.0),
      new GLBoost.Vector3(-1.0,  0.5, 0.0),

      new GLBoost.Vector3(-1.0, 0.5, 0.0),
      new GLBoost.Vector3(1.0, -0.5, 0.0),
      new GLBoost.Vector3(1.0,  0.5, 0.0)
    ];
    var shapetarget_2 = [
      new GLBoost.Vector3(-0.5, -1.0, 0.0),
      new GLBoost.Vector3(0.5, -1.0, 0.0),
      new GLBoost.Vector3(-0.5,  1.0, 0.0),

      new GLBoost.Vector3(-0.5, 1.0, 0.0),
      new GLBoost.Vector3(0.5, -1.0, 0.0),
      new GLBoost.Vector3(0.5,  1.0, 0.0)
    ];
    var texcoords = [
      new GLBoost.Vector2(0.0, 1.0),
      new GLBoost.Vector2(1.0, 1.0),
      new GLBoost.Vector2(0.0, 0.0),

      new GLBoost.Vector2(0.0, 0.0),
      new GLBoost.Vector2(1.0, 1.0),
      new GLBoost.Vector2(1.0, 0.0)
    ];

    var geometry = glBoostContext.createBlendShapeGeometry();
    var texture = glBoostContext.createTexture('//cdn.rawgit.com/emadurandal/GLBoost/master/examples/for_phina/multiple_render_passes/resources/texture.png');
    var material = glBoostContext.createClassicMaterial();
    material.setTexture(texture);
    var mesh = glBoostContext.createMesh(geometry, material);
    geometry.setVerticesData({
      position: positions,
      texcoord: texcoords,
      shapetarget_1: shapetarget_1,
      shapetarget_2: shapetarget_2
    });
    var scene = glBoostContext.createScene();
    scene.addChild( mesh );

    renderPasses[0].setClearColor(new GLBoost.Vector4(0, 0, 0, 1));
    renderPasses[0].specifyRenderTargetTextures(renderTextures);
    renderPasses[0].scene = scene;

    var geometry2 = glBoostContext.createGeometry();
    var material2 = glBoostContext.createClassicMaterial();
    material2.setTexture(renderTextures[0]);
    var mesh2 = glBoostContext.createMesh(geometry2, material2);
    geometry2.setVerticesData({
      position: positions,
      texcoord: texcoords
    });
    var scene2 = glBoostContext.createScene();
    scene2.addChild( mesh2 );

    renderPasses[1].setClearColor(new GLBoost.Vector4(1, 0, 0, 1));
    renderPasses[1].scene = scene2;

    layer.expression.clearRenderPasses();
    layer.expression.addRenderPasses(renderPasses);
    layer.expression.prepareToRender();

    var label = Label('phina.jsとGLBoostの\n夢の共演！').addChildTo(this);
    label.fill = 'white';
    label.stroke = 'black';
    label.fontSize = 32;
    label.strokeWidth = 4;
    label.x = this.gridX.center();
    label.y = this.gridY.center();

    var tweener = phina.accessory.Tweener();
    tweener.setTarget(geometry);
    tweener
      .set({blendWeight_1: 0.0}).to({blendWeight_1: 1.0}, 500, 'easeInCirc')
      .set({blendWeight_2: 0.0}).to({blendWeight_2: 1.0}, 500, 'easeOutElastic')
      .to({blendWeight_1: 0.0}, 500, 'easeInOutBack')
      .to({blendWeight_2: 0.0}, 500, 'easeOutCirc')
      .setLoop(true);
    
    layer.update= function(app){
      tweener.update(app);
    };
  }
});

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  });

  app.run();
});

