from queue import PriorityQueue

import firebase_admin
import requests
from firebase_admin import credentials
from firebase_admin import firestore


# from pathlib import Path


class Vertex:
    def __init__(self, cases, code, state):
        self.cases = cases
        self.code = code
        self.state = state
        self.best_cost_from_start = float("inf")
        self.cost_from_start = float("inf")
        self.scratch = 0
        self.adjacent = []
        self.best_prev = code
        self.prev = code
        self.best_path = []
        self.paths = []

    def __lt__(self, other):
        # if (self.cases == other.cases):
        #     return False
        return self.cases <= other.cases


def auth_firebase():
    # data_folder = Path("")
    # TODO: make this into relative path
    cred = credentials.Certificate("/Users/shravanravi/Hackathons/WinterHacklympics-2020/service_account_credentials.json")
    firebase_admin.initialize_app(cred)
    return firestore.client()


def generate_vertices(firestore_db):
    state_case_values = generate_costs()
    airports_ref = firestore_db.collection(u'airports')
    airports = airports_ref.stream()

    vertices = {}
    for airport in airports:
        airports_dict = airport.to_dict()
        num_connections = len(airports_dict['connections'])
        cases = state_case_values[airports_dict['state']] * num_connections
        vertices[airport.id] = Vertex(cases, airport.id, airports_dict['state'])
        vertices[airport.id].adjacent = airports_dict['connections']
    return vertices


def generate_costs():
    state_case_values = {}
    request = requests.get("https://api.covidtracking.com/v1/states/current.json")
    for information in request.json():
        state_case_values[information['state']] = information['positive'] * 0.00001
    return state_case_values


class Graph:

    def clear_all(self):
        for vertex in self.vertices:
            cur_vertex = self.vertices[vertex]
            cur_vertex.cost_from_start = float("inf")
            cur_vertex.scratch = 0
            cur_vertex.prev = None



    def find_other_paths(self, start_vertex):
        self.clear_all()
        if (start_vertex is None):
            print("Invalid start vertex.")
            return None
        self.start = start_vertex
        flight_paths = PriorityQueue()
        start_vertex.cost_from_start = 0
        flight_paths.put(start_vertex)
        while not flight_paths.empty():
            cur_vertex = flight_paths.get()
            cur_vertex.scratch = -1
            for connection_name in cur_vertex.adjacent:
                connection = self.vertices[connection_name]
                cost = cur_vertex.cost_from_start + connection.cases
                if connection.scratch != -1:
                    if len(connection.paths) <= 5:
                        connection.cost_from_start = cost
                        connection.prev = cur_vertex.code
                        connection.paths.append(self.get_path(connection.code))
                        flight_paths.put(connection)


    def get_path(self, dest):
        path = []
        cur_vertex = self.vertices[dest]
        while cur_vertex != self.start:
            path.append(cur_vertex.code)
            cur_vertex = self.vertices.get(cur_vertex.prev)
        path.append(self.start.code)
        path.reverse()
        cost = self.vertices[dest].cost_from_start
        path.append(cost)
        return path


    def get_all_paths(self, dest):
        return self.vertices[dest].paths

    def __init__(self, start):
        firestore_db = auth_firebase()
        self.vertices = generate_vertices(firestore_db)
        self.find_other_paths(self.vertices[start])
