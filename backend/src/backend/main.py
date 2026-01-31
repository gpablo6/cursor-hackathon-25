import logging

from backend.logging_config import configure_logging


def main() -> None:
    configure_logging()
    logger = logging.getLogger(__name__)
    logger.info("Hello from backend!")


if __name__ == "__main__":
    main()
