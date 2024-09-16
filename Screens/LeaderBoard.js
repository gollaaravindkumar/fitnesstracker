import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MainUser from '../Components/MainUser';
import { StepsContext } from '../Components/StepsContext';
import MyActivity from '../Components/MyActivity';
import DateRangePicker from '../Components/DateRangePicker';
import moment from 'moment';

const LeaderBoard = () => {
  const { weeklySteps, totalSteps } = useContext(StepsContext);
  
  const isValidWeekSteps = Array.isArray(weeklySteps) && weeklySteps.length === 7;

  const [selected, setSelected] = useState("Rank");
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(moment().startOf('day').toDate());
  const [endDate, setEndDate] = useState(moment().endOf('day').toDate());

  // Mock data for leaderboard - replace with actual data fetching
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  useEffect(() => {
    // Fetch data or use a static example
    // Example static data
    setLeaderBoardData([
      { id: 1, name: "Aravind Team", steps: totalSteps, image: "https://randomuser.me/api/portraits/men/1.jpg" },
      { id: 2, name: "John Doe", steps: 600, image: "https://randomuser.me/api/portraits/men/5.jpg" },
      { id: 3, name: "Jane Smith", steps: 500, image: "https://randomuser.me/api/portraits/women/6.jpg" },
      { id: 4, name: "Chris Evans", steps: 400, image: "https://randomuser.me/api/portraits/men/7.jpg" },
      { id: 5, name: "Michael Brown", steps: 300, image: "https://randomuser.me/api/portraits/women/8.jpg" },
      { id: 6, name: "Linda Taylor", steps: 200, image: "https://randomuser.me/api/portraits/men/9.jpg" },
      { id: 7, name: "David Wilson", steps: 100, image: "https://randomuser.me/api/portraits/women/10.jpg" },
    ]);
  }, [totalSteps]); // Depend on `todaySteps` if it's dynamic

  const sortedData = leaderBoardData.sort((a, b) => b.steps - a.steps);

  const chartData = isValidWeekSteps ? {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: weeklySteps }],
  } : {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  };

  const getCrownColor = (index) => {
    switch(index) {
      case 0: return "#FFD700"; // Gold
      case 1: return "#C0C0C0"; // Silver
      case 2: return "#cd7f32"; // Bronze
      default: return "transparent"; // No crown
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
        />
        <Feather name="search" size={24} color="black" style={styles.searchIcon} />
      </View>

      {/* Date Range Picker */}
      <DateRangePicker 
        startDate={startDate}
        endDate={endDate}
        isStartPickerVisible={isStartPickerVisible}
        isEndPickerVisible={isEndPickerVisible}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setStartPickerVisible={setStartPickerVisible}
        setEndPickerVisible={setEndPickerVisible}
      />

      <MainUser />

      {/* Toggle Buttons */}
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[styles.toggleButton, selected === 'Rank' && styles.selectedButton]}
          onPress={() => setSelected('Rank')}
        >
          <Text style={styles.buttonText}>Rank</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, selected === 'MyActivity' && styles.selectedButton]}
          onPress={() => setSelected('MyActivity')}
        >
          <Text style={styles.buttonText}>My Activity</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally Render Content Based on Selected */}
      {selected === 'Rank' ? (
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.rankItem}>
              {/* Rank Display */}
              <View style={styles.rankNumber}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>

              {/* User Info */}
              <View style={styles.userDetails}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.userImage}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userSteps}>{item.steps} steps</Text>
                </View>
              </View>

              {/* Crown Icon for Top 3 */}
              {index < 3 && (
                <FontAwesome6 name="crown" size={24} color={getCrownColor(index)} style={styles.crownIcon} />
              )}
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <MyActivity />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3E3E3',
    borderRadius: 20,
    width: '90%',
    height: Dimensions.get('screen').height * 0.042,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    height: 54,
    backgroundColor: '#000000',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
  },
  selectedButton: {
    backgroundColor: '#000000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: Dimensions.get('window').width, // Full width
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  rankNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#fff',
    fontSize: 16,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSteps: {
    fontSize: 14,
    color: '#666',
  },
  crownIcon: {
    marginLeft: 10,
  },
  listContainer: {
    width: '100%',
  },
});

export default LeaderBoard;
