Crafty.scene 'Credits', (targetScene) ->
  # Programming
  Crafty.e('2D, DOM, Text').text('Programming:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr
    x: 0
    y: 30
    w: Game.width()
    h: 50

  craftyLink = '<a target="_blank" href="https://craftyjs.com">https://craftyjs.com</a>'
  flowerTowerLink = '<a target="_blank" href="https://www.github.com/olilo/flower-tower-defense/">' +
        'http://www.github.com/olilo/flower-tower-defense</a>'
  programmingText =
        'Game-Framework is Crafty (' + craftyLink + ')<br />' +
        'Programming is done by me (' + flowerTowerLink +  ')'
  Crafty.e('2D, DOM, Text').text(programmingText).textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr
    x: 0
    y: 70
    w: Game.width()
    h: 100


  # Graphics
  Crafty.e('2D, DOM, Text').text('Graphics:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr
    x: 0
    y: 140
    w: Game.width()
    h: 50

  joewilliamsLink = '<a target="_blank" href="https://opengameart.org/content/roguelike-bosses">Joe Williamson</a>'
  opengameartLink = '<a target="_blank" href="https://opengameart.org">https://opengameart.org</a>'
  graphicsText =
        'roguelikebosses (orc, dragons, spider) by @JoeCreates (' + joewilliamsLink + ') <br />' +
        'Witch graphic by Heather Harvey - cind_rella@hotmail.com<br />' +
        'Generally: art from ' + opengameartLink + '<br />' +
        'Knight and flowers by me ^^ (license-free)'
  Crafty.e('2D, DOM, Text').text(graphicsText).textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr
    x: 0
    y: 180
    w: Game.width()
    h: 120


  # Music
  Crafty.e('2D, DOM, Text').text('Music:').textFont(Game.creditsFont).textColor(Game.highlightColor).css(Game.centerCss).attr
    x: 0
    y: 300
    w: Game.width()
    h: 50

  musicMakerJamLink = '<a target="_blank" href="https://apps.microsoft.com/store/detail/music-maker-jam/9WZDNCRFJ9Z5">Music Maker Jam</a>'
  wakianTechLink = '<a target="_blank" href="https://opengameart.org/users/tkz-productions">WakianTech</a>'
  musicText =
        'Title-Song and Won-Song generated by Music Maker Jam (' + musicMakerJamLink + ')<br />' +
        'Main Game-Music by ' + wakianTechLink
  Crafty.e('2D, DOM, Text').text(musicText).textFont(Game.creditsTextFont).textColor(Game.textColor).css(Game.centerCss).attr
    x: 0
    y: 340
    w: Game.width()
    h: 100

  # Back Link
  if targetScene.text
    Crafty.e('DOMButton').text(targetScene.text).attr(
      x: 280
      y: Game.height() - 50
      w: 200
      h: 50).tooltip('Continue to next screen').bind 'Click', ->
        Crafty.scene targetScene.scene
        return
  else
    Crafty.e('DOMButton').text('Back').attr(
      x: 280
      y: Game.height() - 50
      w: 200
      h: 50).tooltip('Go back to where you came from').bind 'Click', ->
        Crafty.enterScene targetScene, {dontRestartMenuMusic: true}
        return

  # Sound Button
  Crafty.e('SoundButton').attr
    x: 470
    y: Game.height() - 50
    w: 200
    h: 50
    blablubb: 10

  return
