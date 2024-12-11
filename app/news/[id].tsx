import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Loading } from "@/components";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { NewsDataType } from "@/types";
import axios from "axios";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const NewsDetails = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    getNews();
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      renderBookmark(news[0].article_id);
    }
  }, [isLoading]);

  const getNews = async () => {
    try {
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${id}`;
      const response = await axios.get(URL);

      if (response && response.data) {
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("Get News Error Message: ", error.message);
    }
  };

  const renderBookmark = async (newsId: string) => {
    const token = await AsyncStorage.getItem("bookmark");

    // Check if the token is null before parsing
    if (token !== null) {
      const res = JSON.parse(token);
      if (res !== null) {
        const data = res.find((value: string) => value === newsId);
        setBookmark(data !== null && data !== undefined);
      } else {
        setBookmark(false);
      }
    } else {
      setBookmark(false);
    }
  };

  // Save News to bookmark
  const saveBookmark = async (newsId: string) => {
    try {
      setBookmark(true);

      // Fetch existing bookmarks
      const token = await AsyncStorage.getItem("bookmark");
      const res = token ? JSON.parse(token) : [];

      // Check if the newsId already exists in the bookmarks
      if (res) {
        console.log("res::", res);
        let data = res.find((value: string) => value === newsId);
        if (data == null) {
          res.push(newsId);
          await AsyncStorage.setItem("bookmark", JSON.stringify(res));
          alert("News Saved Successfully!");
        }
      } else {
        // being the firt item to be saved
        let bookmark = [];
        bookmark.push(newsId);
        AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
        alert("News Save Successfully!");
      }
    } catch (error) {
      console.error("Error saving bookmark: ", error);
      alert("Failed to save the news. Please try again.");
    }
  };

  // Remove News from bookmark
  const removeBookmark = async (newsId: string) => {
    try {
      setBookmark(false);

      // Fetch existing bookmarks
      const token = await AsyncStorage.getItem("bookmark");
      const res = token ? JSON.parse(token) : [];

      // Remove the newsId from the bookmarks
      const updatedBookmarks = res.filter((id: string) => id !== newsId);
      await AsyncStorage.setItem("bookmark", JSON.stringify(updatedBookmarks));

      alert("News Unsaved Successfully");
    } catch (error) {
      console.error("Error removing bookmark: ", error);
      alert("Failed to unsave the news. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={Colors.black} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                bookmark
                  ? removeBookmark(news[0].article_id)
                  : saveBookmark(news[0].article_id)
              }
            >
              <Ionicons
                name={bookmark ? "heart" : "heart-outline"}
                size={22}
                color={bookmark ? Colors.tint : Colors.black}
              />
            </TouchableOpacity>
          ),
          title: "",
        }}
      />
      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
          <Text style={styles.title}>{news[0].title}</Text>
          <View style={styles.newsInfoWrapper}>
            <Text style={styles.newsInfo}>
              {moment(news[0].pubDate).format("MMM DD, hh:mm a")}
            </Text>
            <Text style={styles.newsInfo}>{news[0].source_name}</Text>
          </View>
          <Image source={{ uri: news[0].image_url }} style={styles.newsImg} />
          {news[0].content ? (
            <Text style={styles.newsContent}>{news[0].content}</Text>
          ) : (
            <Text style={styles.newsContent}>{news[0].description}</Text>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginVertical: 10,
    letterSpacing: 0.6,
  },
  newsImg: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  newsInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  newsInfo: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  newsContent: {
    fontSize: 14,
    color: "#555",
    letterSpacing: 0.8,
    lineHeight: 22,
  },
  contaxiner: {},
});
