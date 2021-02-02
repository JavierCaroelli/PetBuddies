import React from "react";
import { styles } from "../../WalkerCard/styles";
import {hotel} from '../../../NavigationConfig/types'
import { View, Text, TouchableOpacity } from "react-native";
import { Card, Image, Icon, CheckBox, Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_900Black_Italic,
  NunitoSans_600SemiBold_Italic,
  NunitoSans_600SemiBold,
  NunitoSans_300Light_Italic,
  NunitoSans_300Light,
} from "@expo-google-fonts/nunito-sans";

import { useAppDispatch, RootState } from "../../../redux/store";
import { getOwnerFavHotels } from '../../../redux/owner/actions'
import AsyncStorage from "@react-native-async-storage/async-storage";
interface Props {
  hotel: hotel,
  /* userFavorites: walker[] */
}
const HotelCard: React.FC<Props> = ({ hotel /*,  userFavorites */ }): JSX.Element => {
  const [checked, setChecked] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const id:string = AsyncStorage.getItem("@id");

  const navigation = useNavigation();
  let [fonts] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_900Black_Italic,
    NunitoSans_600SemiBold_Italic,
    NunitoSans_600SemiBold,
    NunitoSans_300Light_Italic,
    NunitoSans_300Light,
  });

  if (!fonts) return <Icon name="spinner" reverse type="font-awesome-5" />;

  return (
    <Card containerStyle={styles.container}>
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => navigation.navigate("HotelProfile", { id: hotel._id })}
      >
        <View style={styles.cardHeader}>
          <Image
            style={{
              height: 100,
              width: 100,
              borderRadius: 4,
              marginRight: 10,
              marginTop: 3,
              marginBottom: 7,
            }}
            source={{
              uri: `${hotel.photo}`,
            }}
          />

          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>
              {`${hotel.name}`}
            </Text>

            <Text style={styles.text}>
              <Text style={styles.pricing}>${hotel.fee}</Text>
              <Text style={{ fontFamily: "NunitoSans_400Regular" }}>/night</Text>
            </Text>
          </View>
        </View>

        <View>
          <Card.Divider />
          <Text style={{ fontFamily: "NunitoSans_600SemiBold", fontSize: 20 }}>
            {hotel.description}
          </Text>
          <View style={styles.workZone}>
            <Icon
              style={styles.icon}
              name="map-marker-alt"
              type="font-awesome-5"
              size={20}
              color="#fc5185"
            />
            
               <Text style={{textTransform: 'capitalize', fontWeight: 'bold', marginRight: 20}}>{hotel.zone}</Text>
          </View>

          <View style={styles.cardHeaderRate}>
            <Text style={{ marginRight: 5, fontSize: 15 }}>
              { hotel.rating } 
            </Text>
            <Icon
              name="star-o"
              type="font-awesome"
              size={18}
              color="green"
              underlayColor="red"
            />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.fav}>
        <CheckBox
          uncheckedIcon={
            <Icon
              raised
              name="heart-o"
              type="font-awesome"
              size={12}
              color="black"
            />
          }
          checkedIcon={
            <Icon
              raised
              name="heart"
              type="font-awesome"
              size={12}
              color={"red"}
            />
          }
          checked={checked}
          onPress={async () => {
            if (!checked) {
            
              const result = await axios.patch(
                `/owners/${id}/favoritesHotels`,
                { hotelId: hotel._id }
              );
              dispatch(getOwnerFavHotels(id));
              return setChecked(true);
            } else {
              const result = await axios.delete(
                `/owners/${id}/favoritesHotels/` + hotel._id
              );
              dispatch(getOwnerFavHotels(id));
              return setChecked(false);
            }
          }} 
        />
      </View>
    </Card>
  );
};

export default HotelCard;

