import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() => runApp(MediaPlayerApp());

class MediaPlayerApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ultimate Media Player',
      theme: ThemeData(primarySwatch: Colors.red),
      home: SplashScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _controller;
  late List<AnimationController> _barControllers;
  late List<Animation<double>> _barAnimations;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: Duration(seconds: 3), vsync: this);
    
    _barControllers = List.generate(5, (index) => 
      AnimationController(duration: Duration(milliseconds: 800 + (index * 200)), vsync: this));
    
    _barAnimations = _barControllers.map((controller) => 
      Tween<double>(begin: 0.2, end: 1.0).animate(controller)).toList();
    
    _controller.forward();
    
    for (var controller in _barControllers) {
      controller.repeat(reverse: true);
    }
    
    Future.delayed(Duration(seconds: 4), () {
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => PlayerScreen()));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF0f0f23), Color(0xFF1a1a2e)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Center(
          child: FadeTransition(
            opacity: _controller,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: [Colors.red, Colors.deepOrange]),
                    borderRadius: BorderRadius.circular(30),
                    boxShadow: [BoxShadow(color: Colors.red.withOpacity(0.3), blurRadius: 20)],
                  ),
                  child: Icon(Icons.play_circle_filled, size: 60, color: Colors.white),
                ),
                SizedBox(height: 30),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: _barAnimations.map((animation) => 
                    AnimatedBuilder(
                      animation: animation,
                      builder: (context, child) {
                        return Container(
                          width: 6,
                          height: 40 * animation.value,
                          margin: EdgeInsets.symmetric(horizontal: 2),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(colors: [Colors.red, Colors.deepOrange]),
                            borderRadius: BorderRadius.circular(3),
                          ),
                        );
                      },
                    ),
                  ).toList(),
                ),
                SizedBox(height: 30),
                Text('SOHAM MISRA', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 3)),
                SizedBox(height: 10),
                Text('Ultimate Media Player', style: TextStyle(fontSize: 16, color: Colors.grey[400])),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    for (var controller in _barControllers) {
      controller.dispose();
    }
    super.dispose();
  }
}

class PlayerScreen extends StatefulWidget {
  @override
  _PlayerScreenState createState() => _PlayerScreenState();
}

class _PlayerScreenState extends State<PlayerScreen> with TickerProviderStateMixin {
  late AnimationController _rotationController;
  late AnimationController _waveController;
  late Animation<double> _rotationAnimation;
  bool isPlaying = false;
  double progress = 0.3;
  String currentSong = 'Bohemian Rhapsody';
  String currentArtist = 'Queen';

  @override
  void initState() {
    super.initState();
    _rotationController = AnimationController(duration: Duration(seconds: 10), vsync: this);
    _waveController = AnimationController(duration: Duration(seconds: 2), vsync: this);
    _rotationAnimation = Tween<double>(begin: 0, end: 1).animate(_rotationController);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0f0f23),
      appBar: AppBar(
        title: Text('MediaPro'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.red, Colors.deepOrange]))),
        actions: [
          IconButton(icon: Icon(Icons.equalizer), onPressed: _showEqualizer),
          IconButton(icon: Icon(Icons.playlist_play), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            _buildAlbumArt(),
            SizedBox(height: 30),
            _buildTrackInfo(),
            SizedBox(height: 30),
            _buildProgressBar(),
            SizedBox(height: 30),
            _buildControls(),
            SizedBox(height: 30),
            _buildLibrary(),
          ],
        ),
      ),
    );
  }

  Widget _buildAlbumArt() {
    return Center(
      child: Stack(
        alignment: Alignment.center,
        children: [
          RotationTransition(
            turns: _rotationAnimation,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [Colors.red, Colors.deepOrange]),
                borderRadius: BorderRadius.circular(125),
                boxShadow: [BoxShadow(color: Colors.red.withOpacity(0.3), blurRadius: 30, spreadRadius: 5)],
              ),
              child: Icon(Icons.music_note, size: 100, color: Colors.white),
            ),
          ),
          if (isPlaying) _buildVisualizer(),
        ],
      ),
    );
  }

  Widget _buildVisualizer() {
    return Positioned(
      bottom: -20,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(8, (index) => 
          TweenAnimationBuilder<double>(
            tween: Tween<double>(begin: 0.2, end: 1.0),
            duration: Duration(milliseconds: 300 + (index * 100)),
            builder: (context, value, child) {
              return Container(
                width: 4,
                height: 30 * value,
                margin: EdgeInsets.symmetric(horizontal: 2),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.red, Colors.deepOrange]),
                  borderRadius: BorderRadius.circular(2),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildTrackInfo() {
    return Column(
      children: [
        Text(currentSong, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
        SizedBox(height: 8),
        Text(currentArtist, style: TextStyle(fontSize: 16, color: Colors.grey[400])),
        SizedBox(height: 8),
        Text('A Night at the Opera', style: TextStyle(fontSize: 14, color: Colors.grey[500])),
      ],
    );
  }

  Widget _buildProgressBar() {
    return Column(
      children: [
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            activeTrackColor: Colors.red,
            inactiveTrackColor: Colors.grey[700],
            thumbColor: Colors.red,
            overlayColor: Colors.red.withOpacity(0.2),
          ),
          child: Slider(
            value: progress,
            onChanged: (value) {
              setState(() {
                progress = value;
              });
            },
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('1:47', style: TextStyle(color: Colors.grey[400])),
              Text('5:55', style: TextStyle(color: Colors.grey[400])),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildControls() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildControlButton(Icons.shuffle, false),
        _buildControlButton(Icons.skip_previous, false),
        GestureDetector(
          onTap: _togglePlayPause,
          child: Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [Colors.red, Colors.deepOrange]),
              borderRadius: BorderRadius.circular(35),
              boxShadow: [BoxShadow(color: Colors.red.withOpacity(0.3), blurRadius: 15)],
            ),
            child: Icon(
              isPlaying ? Icons.pause : Icons.play_arrow,
              size: 35,
              color: Colors.white,
            ),
          ),
        ),
        _buildControlButton(Icons.skip_next, false),
        _buildControlButton(Icons.repeat, false),
      ],
    );
  }

  Widget _buildControlButton(IconData icon, bool active) {
    return GestureDetector(
      onTap: () => HapticFeedback.lightImpact(),
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          color: active ? Colors.red : Colors.grey[800],
          borderRadius: BorderRadius.circular(25),
        ),
        child: Icon(icon, color: Colors.white, size: 24),
      ),
    );
  }

  Widget _buildLibrary() {
    final songs = [
      {'title': 'Hotel California', 'artist': 'Eagles', 'duration': '6:30'},
      {'title': 'Imagine', 'artist': 'John Lennon', 'duration': '3:07'},
      {'title': 'Stairway to Heaven', 'artist': 'Led Zeppelin', 'duration': '8:02'},
      {'title': 'Billie Jean', 'artist': 'Michael Jackson', 'duration': '4:54'},
    ];

    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFF1a1a2e),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.red.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Up Next', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          SizedBox(height: 16),
          ...songs.map((song) => _buildSongItem(song)).toList(),
        ],
      ),
    );
  }

  Widget _buildSongItem(Map<String, String> song) {
    return GestureDetector(
      onTap: () {
        setState(() {
          currentSong = song['title']!;
          currentArtist = song['artist']!;
        });
        HapticFeedback.lightImpact();
      },
      child: Container(
        margin: EdgeInsets.only(bottom: 12),
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [Colors.red, Colors.deepOrange]),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Icon(Icons.music_note, color: Colors.white, size: 20),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(song['title']!, style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                  Text(song['artist']!, style: TextStyle(color: Colors.grey[400], fontSize: 12)),
                ],
              ),
            ),
            Text(song['duration']!, style: TextStyle(color: Colors.red, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  void _togglePlayPause() {
    setState(() {
      isPlaying = !isPlaying;
    });
    
    if (isPlaying) {
      _rotationController.repeat();
      _waveController.repeat(reverse: true);
    } else {
      _rotationController.stop();
      _waveController.stop();
    }
    
    HapticFeedback.mediumImpact();
  }

  void _showEqualizer() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Color(0xFF1a1a2e),
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Equalizer', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: ['60Hz', '170Hz', '310Hz', '600Hz', '1kHz', '3kHz', '6kHz', '12kHz'].map((freq) => 
                Column(
                  children: [
                    Container(
                      height: 100,
                      width: 30,
                      child: RotatedBox(
                        quarterTurns: 3,
                        child: SliderTheme(
                          data: SliderTheme.of(context).copyWith(
                            activeTrackColor: Colors.red,
                            inactiveTrackColor: Colors.grey[700],
                            thumbColor: Colors.red,
                          ),
                          child: Slider(value: 0.5, onChanged: (value) {}),
                        ),
                      ),
                    ),
                    Text(freq, style: TextStyle(color: Colors.white, fontSize: 10)),
                  ],
                ),
              ).toList(),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _rotationController.dispose();
    _waveController.dispose();
    super.dispose();
  }
}