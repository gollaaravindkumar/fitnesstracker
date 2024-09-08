import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import React,{useContext} from 'react';
import { StepsContext } from '../Components/StepsContext'; 
const MainUser = () => {

  const { weeklySteps, totalSteps } = useContext(StepsContext);
  const LeaderBoardData = [
    {
      id: 1,
      name: "Harsha",
      steps: totalSteps, // High value to ensure Harsha is always at the top
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    }
  ];
  return (
    <View style={styles.container}>
      <FlatList
        data={LeaderBoardData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.steps}>{item.steps} steps</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3E3E3',
    

   width:"100%",
   height: 60,
   borderRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 40,
                  height: 40,
                  left:40,
                  borderRadius: 20,
                  backgroundColor: "#ddd",
                  marginRight: 10,
  },
  textContainer: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#405D72",
    marginLeft:40
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  steps: {
    fontSize: 14,
    color: '#555',
  },
});

export default MainUser;
