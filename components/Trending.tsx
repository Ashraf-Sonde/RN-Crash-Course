import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { useVideoPlayer, VideoView } from "expo-video";
import { icons } from "@/constants";

// Custom Animations
const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

// functionName: TrendingItem
// Description: Trending item component
const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  console.log("========>", item.video);

  const player = useVideoPlayer(item.video, (player) => {
    player.play();
  });

  return (
    <Animatable.View
      className={"mr-5"}
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
      useNativeDriver={true}
    >
      {play ? (
        // <Video
        //   source={{ uri: item.video }}
        //   className={"w-52 h-72 rounded-3xl mt-3 bg-white/10"}
        //   resizeMode={ResizeMode.CONTAIN}
        //   useNativeControls={true}
        //   shouldPlay={true}
        //   onPlaybackStatusUpdate={(status) => {
        //     if (status.didJustFinish) {
        //       setPlay(false);
        //     }
        //   }}
        // />

        <VideoView
          player={player}
          className={"w-52 h-72 rounded-3xl mt-3 bg-white/10"}
          allowsFullscreen={true}
          allowsPictureInPicture={false}
          nativeControls={true}
        />
      ) : (
        <TouchableOpacity
          className={"relative flex justify-center items-center"}
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className={
              "my-5 w-52 h-72 rounded-3xl overflow-hidden shadow-lg shadow-black/40"
            }
            resizeMode={"cover"}
          />
          <Image
            source={icons.play}
            className={"w-12 h-12 absolute"}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

// functionName: Trending
// Description: Displays the trending posts
const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      horizontal={true}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170, y: 0 }}
    />
  );
};

export default Trending;
