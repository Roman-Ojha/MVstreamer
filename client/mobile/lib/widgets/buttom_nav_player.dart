import 'package:flutter/material.dart';
import 'buttom_navigation_bar.dart';
import 'mini_player.dart';
import 'min_player.dart';
import '../screens/video_player_screen.dart';

class ButtomNavPlayer extends StatefulWidget {
  const ButtomNavPlayer({Key? key}) : super(key: key);

  @override
  _ButtomNavPlayerState createState() => _ButtomNavPlayerState();
}

class _ButtomNavPlayerState extends State<ButtomNavPlayer> {
  @override
  Widget build(BuildContext context) {
    return Container(
      // height: 200,
      color: Colors.transparent,
      child: Stack(
        // fit: StackFit.loose,
        // clipBehavior: Clip.none,
        alignment: AlignmentDirectional.bottomCenter,
        // clipBehavior: Clip.antiAlias,
        // mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 45),
            child: GestureDetector(
              child: const MinPlayer(),
              onTap: () {
                Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const VideoPlayerScreen(),
                ));
              },
            ),
          ),
          // MiniPlayer(),
          const ButtomNavigationBarWidget(),
        ],
      ),
    );
    // return Positioned(
    //   bottom: 0,
    //   child: Container(
    //     width: 100,
    //     height: 100,
    //     decoration: BoxDecoration(
    //       color: Colors.white,
    //       borderRadius: BorderRadius.circular(100),
    //       border: Border.all(width: 100, color: Colors.transparent),
    //     ),
    //   ),
    // );
  }
}
