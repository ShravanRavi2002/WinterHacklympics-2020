import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;


public class Preprocessor {

    public static void main(String[] args) {
        getAirportLocation();
    }

    public static TreeMap<String, TreeSet<String>> preprocess() {
        TreeMap<String, TreeSet<String>> routes = new TreeMap<>();
        getAirportLocation();
        parseData(routes);
        return routes;
    }

    // Read the routes data and creates a TreeMap containing all the connections for a given airport
    private static void parseData(TreeMap<String, TreeSet<String>> routes) {
        HashMap<String, String> locations = getAirportLocation();
        File file = new File("routes.txt");
        try (Scanner sc = new Scanner(file, StandardCharsets.UTF_8.name())) {
            while (sc.hasNextLine()) {
                String next = sc.nextLine();
                String[] route = next.split(",");
                String start = route[2];
                String dest = route[4];
                if(locations.containsKey(start)) {
                    if (!routes.containsKey(start)) {
                        routes.put(start, new TreeSet<>());
                    }
                    if(locations.containsKey(dest)) {
                        routes.get(start).add(dest);
                        if(!routes.containsKey(dest))
                            routes.put(dest, new TreeSet<>());
                    }

                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Reads through the state_abbreviations.json to translate state names to
    // their respective abbreviation in a HashMap
    private static HashMap<String, String> getAbbreviations() {
        File file = new File("state_abbreviations.txt");
        HashMap<String, String> abbreviations = new HashMap<>();
        try (Scanner sc = new Scanner(file, StandardCharsets.UTF_8.name())) {
            while (sc.hasNextLine()) {
                String next = sc.nextLine();
                String[] abbrevs = next.split(": ");
                abbreviations.put(abbrevs[0], abbrevs[1].substring(1, 3));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return abbreviations;
    }

    // Reads through the airports text file to create a mapping from airport code to state name
    public static HashMap<String, String> getAirportLocation() {
        HashMap<String, String> airportLocations = new HashMap<>();
        HashMap<String, String> abbrevs = getAbbreviations();
        JSONParser parser = new JSONParser();
        try {
            Object obj = parser.parse(new FileReader("airports.json"));
            JSONArray airports = (JSONArray) obj;
            Iterator iterator = airports.iterator();
            while (iterator.hasNext()) {
                JSONObject airport = (JSONObject) iterator.next();
                String code = (String) airport.get("code");
                String state = (String) airport.get("state");
                if (abbrevs.containsKey(state)) {
                    airportLocations.put(code, abbrevs.get(state));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return airportLocations;
    }
}
