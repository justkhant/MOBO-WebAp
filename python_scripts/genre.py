### Script used to generate Genre related CSVs using books and movie csvs


import argparse
import pandas as pd
import json

parser = argparse.ArgumentParser(description='Create genre csv from movies_meta_data')

parser.add_argument('--csv', dest='csv_path', help='path to csv file', required=True)
parser.add_argument('--type', dest='media_type', help='media_type', required=True)
parser.add_argument('--id', dest='starting_id', help='start id generation from')
args = parser.parse_args()

csv_path = args.csv_path
media_type = args.media_type
starting_id = 0
if (args.starting_id is not None):
    starting_id = int(args.starting_id)

def proper_json_format(input_string):
    input_string = input_string.replace("\"", "\'")
    input_string = input_string.replace("{'", "{\"")
    input_string = input_string.replace("':", "\":")
    input_string = input_string.replace("'}", "\"}")
    input_string = input_string.replace(": '", ": \"")
    input_string = input_string.replace(", '", ", \"")
    input_string = input_string.replace("\\xa0", "")
    return input_string

genre_df = pd.read_csv(csv_path, usecols=['genres'])
genre_json_list = genre_df.genres.to_list()

#find all unique genres
genre_set = set([])
#create a dictionary from movies to their genres
movies_to_genre_dict = {}
i = starting_id
for genre_json in genre_json_list: 

    if (media_type == 'M') :
        genre_json = proper_json_format(genre_json)
        genres_list = json.loads(genre_json)
        genres = [entry["name"] for entry in genres_list]

    else :
        genres = str(genre_json).split("|")
        this_book_genre_set = set(genres)

    movies_to_genre_dict[i] = this_book_genre_set
    for genre in genres:
        genre_set.add(genre)
    i = i + 1

if media_type == 'M':   
    all_genre_csv = "all_genres_movies.csv"
    media_to_genre = "movies_to_genre.csv"
else:
    all_genre_csv = "all_genres_books.csv"
    media_to_genre = "books_to_genre.csv"

#create all_genres csv file 
ddl_file = open(all_genre_csv, "w") 
ddl_file.write("genre\n")
for genre in genre_set:
    ddl_file.write(genre + "\n")
ddl_file.close()

print(str(len(genre_set)) + " Genres Found:")
print(genre_set)

#create movies_to_genres csv file
ddl_file2 = open(media_to_genre, "w")
ddl_file2.write("media_id,genre_name\n")

for key in movies_to_genre_dict.keys():
    for genre in movies_to_genre_dict[key]:
        ddl_file2.write(str(key) + "," + genre + "\n")

ddl_file2.close()