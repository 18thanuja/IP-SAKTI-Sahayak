from fastembed import TextEmbedding
_embedding_model = TextEmbedding(
    model_name=EMBEDDING_MODEL
)model = get_embedding_model()
vector = list(model.query_embed(search_query))[0].tolist()
