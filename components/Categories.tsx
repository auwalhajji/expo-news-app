import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import newsCategoryList from "@/constants/Categories";

type Props = {
  onCategoryChanged: (category: string) => void;
};

const Page = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRefs = useRef<(View | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectCategory = (index: number) => {
    const selected = itemRefs.current[index];
    setActiveIndex(index);

    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 20, y: 0, animated: true });
    });

    onCategoryChanged(newsCategoryList[index].slug);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending Right Now</Text>
      <ScrollView
        contentContainerStyle={styles.itemsWrapper}
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
      >
        {newsCategoryList.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelectCategory(index)}
            ref={(ref) => (itemRefs.current[index] = ref)}
            style={[styles.item, activeIndex === index && styles.itemActive]}
          >
            <Text
              style={[
                styles.itemText,
                activeIndex === index && styles.itemActiveTxt,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    marginLeft: 20,
  },
  itemsWrapper: {
    gap: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 2,
    borderRadius: 10,
  },
  item: {
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 14,
    color: Colors.darkGrey,
    letterSpacing: 0.5,
  },
  itemActive: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
  },
  itemActiveTxt: {
    fontWeight: "500",
    color: Colors.white,
  },
});
