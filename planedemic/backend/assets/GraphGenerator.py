import sys
import json
from Graph import Graph


def main():
    test = Graph(sys.argv[1])
    paths = test.get_all_paths(sys.argv[2])
    return print(json.dumps(paths))



if __name__ == '__main__':
    main()
