from flwr.server import strategy
import flwr as fl
import argparse
from flwr.server.strategy import FedAvg


parser = argparse.ArgumentParser()
parser.add_argument("-n", "--numrounds", help = "Sets Number of Rounds")
parser.add_argument("-c","--clients",help="Sets number of clients")

arguments = parser.parse_args()

arguments.numrounds=int(arguments.numrounds.strip())
arguments.clients=int(arguments.clients.strip())

if __name__ == "__main__":
    fl.server.start_server("0.0.0.0:8080", 
        config={"num_rounds": arguments.numrounds},
        force_final_distributed_eval=True,
        strategy=FedAvg(min_fit_clients= arguments.clients,min_eval_clients = arguments.clients,min_available_clients= arguments.clients)
    )
