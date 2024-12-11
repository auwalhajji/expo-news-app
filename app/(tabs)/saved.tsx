import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter, Stack, useNavigation } from "expo-router"; // Correct usage for expo-router
import { Loading } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { NewsDataType } from "@/types";
import { NewsItem } from "@/components/NewsList";

type Props = {};

const Page = (props: Props) => {
  const [bookmarkNews, setBookmarkNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const focused = navigation.isFocused();
  const router = useRouter(); // Correctly initialize the router.

  useEffect(() => {
    fetchBookmark();
    console.log("isFocused::", focused);
  }, [focused]);

  const fetchBookmark = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("bookmark");
      const res = token ? JSON.parse(token) : [];
      if (res.length) {
        const query_string = res.join(",");
        console.log("fetchBookmark-query_string", query_string);
        const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${query_string}`;
        const response = await axios.get(URL);
        setBookmarkNews(response.data.results || []);
      } else {
        setBookmarkNews([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          title: "Bookmarks",
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <Loading size={"large"} />
        ) : (
          <FlatList
            data={bookmarkNews}
            keyExtractor={(_, index) => `list_item${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => router.push(`/news/${item.article_id}`)}
                key={index}
              >
                <NewsItem item={item} />
              </TouchableOpacity>
            )}
          />
        )}
        <Text>{focused ? "focused" : "unfocused"}</Text>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
});
