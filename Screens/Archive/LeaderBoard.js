import React, { useState } from "react";
import {
  View,
  TextInput,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MainUser from "../Components/MainUser";

const LeaderBoard = () => {
  const [selected, setSelected] = useState('Rank');
  const LeaderBoardData = [
    {
      id: 1,
      name: "Harsha",
      steps: 1000, // High value to ensure Harsha is always at the top
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "John Doe",
      steps: 600,
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      id: 3,
      name: "Jane Smith",
      steps: 500,
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
      id: 4,
      name: "Chris Evans",
      steps: 400,
      image: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      id: 5,
      name: "Michael Brown",
      steps: 300,
      image: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    {
      id: 6,
      name: "Linda Taylor",
      steps: 200,
      image: "https://randomuser.me/api/portraits/men/9.jpg",
    },
    {
      id: 7,
      name: "David Wilson",
      steps: 100,
      image: "https://randomuser.me/api/portraits/women/10.jpg",
    },
    // Additional users here
  ];

  const sortedData = LeaderBoardData.sort((a, b) => b.steps - a.steps);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        marginTop: 10,
      }}
    >
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#E3E3E3",
          borderRadius: 20,
          width: "90%",
          height: Dimensions.get("screen").height * 0.042,
          paddingHorizontal: 10,
          marginBottom: 20,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 16,
          }}
          placeholder="Search..."
        />
        <Feather
          name="search"
          size={24}
          color="black"
          style={{ marginLeft: 10 }}
        />
      </View>



      {/* Date Range Picker */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        {/* Start Date Input */}
        <View style={{ width: "42%" }}>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              color: "#758694",
            }}
          >
            Start Date
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 0.2,
              borderRadius: 10,
              paddingHorizontal: 10,
              height: Dimensions.get("screen").height * 0.05,
            }}
          >
            <TextInput
              style={{
                flex: 1,
              }}
              placeholder=""
            />
            <Feather name="calendar" size={20} style={{ marginLeft: 10 }} />
          </View>
        </View>

        {/* End Date Input */}
        <View style={{ width: "42%" }}>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              color: "#758694",
            }}
          >
            End Date
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 0.2,
              borderRadius: 10,
              paddingHorizontal: 10,
              height: Dimensions.get("screen").height * 0.05,
            }}
          >
            <TextInput
              style={{
                flex: 1,
              }}
              placeholder=""
            />
            <Feather name="calendar" size={20} style={{ marginLeft: 10 }} />
          </View>
        </View>
      </View>


  <MainUser/>

      {/* Toggle Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 351,
          height: 54,
          backgroundColor: '#000000',
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 20,
          top:20
        }}



       
    

      >

        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            borderRadius: 20,
            backgroundColor: selected === 'Rank' ? '#000000' : '#1A1A1A',
          }}
          onPress={() => setSelected('Rank')}
        >
          <Text
            style={{
              color: selected === 'Rank' ? '#fff' : '#fff',
              fontSize: 16,
            }}
          >
            Rank
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            borderRadius: 20,
            backgroundColor: selected === 'MyActivity' ? '#000000' : '#1A1A1A',
          }}
          onPress={() => setSelected('MyActivity')}
        >
          <Text
            style={{
              color: selected === 'MyActivity' ? '#fff' : '#fff',
              fontSize: 16,
            }}
          >
            MyActivity
          </Text>
        </TouchableOpacity>

     
      </View>
      {/* Conditionally Render Content Based on Selected */}
      {selected === 'Rank' ? (
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F5F5F5",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginVertical: 5,
                width: 375,
                height: 60,
                gap: 12,
              }}
            >
              {/* Rank Display */}
              <View
                style={{
                  position: 'absolute',
                  left: 20,
                  width: 22.92,
                  height: 22.92,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#E3E3E3', // Background color for rank display
                  borderRadius: 11.46, // Half of width/height for circle
                }}
              >
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Text>
              </View>
              
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 40,
                  height: 40,
                  left:40,
                  borderRadius: 20,
                  backgroundColor: "#ddd",
                  marginRight: 10,
                }}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#405D72",
                    marginLeft:40
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#758694",
                    marginLeft:40
                  }}
                >
                  {item.steps} Steps
                </Text>
              </View>
              {index < 3 && (
                <FontAwesome5
                  name="crown"
                  size={17}
                  color={
                    index === 0
                      ? "#FFD700"
                      : index === 1
                      ? "#C0C0C0"
                      : "#CD7F32"
                  }
                  style={{ marginLeft: 10 }}
                />
              )}
            </View>
          )}
        />
      ) : (
       <View>
        <Text>MyActivity</Text>
       </View>
      )}
    </View>
  );
};

export default LeaderBoard;
