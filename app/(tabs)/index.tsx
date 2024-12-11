import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import {
  BreakingNews,
  Categories,
  Header,
  Loading,
  NewsList,
  SearchBar,
} from "@/components";
import { NewsDataType } from "@/types";
import newsData from "@/constants/localNewsData";

type Props = {};

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>();
  const [news, setNews] = useState<NewsDataType[]>([]); // Initialize with an empty array
  const [localNewsData, setLocalNewsData] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // getLocalBreakingNews();
    getBreakingNews();
    getNews();
    // console.log("Local News Data", newsData);
  }, []);

  const getLocalBreakingNews = () => {
    setBreakingNews(localNewsData!);
  };

  const getBreakingNews = async () => {
    try {
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en&image=1&removeduplicate=1&size=5`;
      const response = await axios.get(URL);

      if (response && response.data) {
        setBreakingNews(response.data.results);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("Error Message: ", error.message);
    }
  };

  const getNews = async (category: string = "") => {
    try {
      let categoryString = "";
      if (category.length !== 0) {
        categoryString = `&category=${category}`;
      }
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&language=en&image=1&removeduplicate=1&size=10${categoryString}`;
      const response = await axios.get(URL);

      if (response && response.data) {
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("Get News Error Message: ", error.message);
    }
  };

  const onCatChanged = (category: string) => {
    console.log(category);
    setNews([]);
    getNews(category);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar withHorizontalPadding={true} setSearchQuery={onCatChanged} />
      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        <BreakingNews newsList={breakingNews ?? []} />
      )}
      <Categories onCategoryChanged={onCatChanged} />
      <NewsList newsList={news!} />
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
